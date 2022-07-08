import {
  CloudFormationClient,
  paginateListStackResources,
  StackResourceSummary,
} from '@aws-sdk/client-cloudformation';
import {
  paginateGetResources,
  ResourceGroupsTaggingAPIClient,
  ResourceTagMapping,
} from '@aws-sdk/client-resource-groups-tagging-api';
import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts';

import { parse } from '@aws-sdk/util-arn-parser';
import { displayProgress } from './display';
import {
  LightBundleRule,
  LimitedNumberOfLambdaVersions,
  noDefaultMemory,
  NoIdenticalCode,
  NoMaxTimeout,
  NoSharedIamRoles,
  UnderMaxMemory,
  UseArm,
  UseIntelligentTiering,
} from './rules';
import { ChecksResults, Options, Resource, Rule, Tag } from './types';

const fetchTaggedResources = async (tags: Tag[]): Promise<Resource[]> => {
  const tagClient = new ResourceGroupsTaggingAPIClient({});

  const taggedResources: ResourceTagMapping[] = [];
  for await (const page of paginateGetResources(
    { client: tagClient },
    {
      TagFilters: tags.map(({ key, value }) => {
        return { Key: key, Values: [value] };
      }),
    },
  )) {
    taggedResources.push(...(page.ResourceTagMappingList ?? []));
  }

  return taggedResources.map(resource => {
    return {
      arn: parse(resource.ResourceARN as string),
    };
  });
};

const fetchCloudFormationResources = async (
  cloudformation: string,
): Promise<Resource[]> => {
  const cloudFormationClient = new CloudFormationClient({});
  const stsClient = new STSClient({});

  const resources: StackResourceSummary[] = [];
  for await (const page of paginateListStackResources(
    { client: cloudFormationClient },
    { StackName: cloudformation },
  )) {
    resources.push(...(page.StackResourceSummaries ?? []));
  }

  const { Account } = await stsClient.send(new GetCallerIdentityCommand({}));
  const region =
    process.env.AWS_REGION ?? (await cloudFormationClient.config.region());

  return resources.flatMap(resource => {
    return getSupportedResourceARN(resource, region, Account);
  });
};

const getS3ResourceARN = (
  region: string,
  accountId: string,
  resource: string,
): Resource => {
  return {
    arn: {
      partition: 'aws',
      service: 's3',
      region,
      accountId,
      resource,
    },
  };
};

const getLambdaResourceARN = (
  region: string,
  accountId: string,
  resource: string,
): Resource => {
  return {
    arn: {
      partition: 'aws',
      service: 'lambda',
      region,
      accountId,
      resource,
    },
  };
};

const getSupportedResourceARN = (
  { ResourceType, PhysicalResourceId }: StackResourceSummary,
  region: string,
  account: string | undefined,
): Resource[] => {
  const resourceARN = [];

  if (ResourceType === 'AWS::Lambda::Function') {
    resourceARN.push(
      getLambdaResourceARN(region, account ?? '', PhysicalResourceId ?? ''),
    );
  }

  if (ResourceType === 'AWS::S3::Bucket') {
    resourceARN.push(
      getS3ResourceARN(region, account ?? '', PhysicalResourceId ?? ''),
    );
  }

  return resourceARN;
};

const fetchResources = async (
  cloudformation: string | undefined,
  tags: Tag[] | undefined,
) => {
  if (tags !== undefined) {
    return fetchTaggedResources(tags);
  }

  if (cloudformation !== undefined) {
    return fetchCloudFormationResources(cloudformation);
  }

  // Maybe replace with a check of all account on the specified region ?
  throw new Error('not enough argument specified');
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const runGuardianChecks = async ({
  cloudformation,
  tags,
}: Options): Promise<ChecksResults> => {
  const resourcesArn = await fetchResources(cloudformation, tags);
  const rules: Rule[] = [
    LightBundleRule,
    NoIdenticalCode,
    noDefaultMemory,
    NoMaxTimeout,
    NoSharedIamRoles,
    UseArm,
    UseIntelligentTiering,
    LimitedNumberOfLambdaVersions,
    UnderMaxMemory,
  ];

  let remaining = rules.length + 1;

  const decreaseRemaining = () => {
    remaining -= 1;
    const rate = (rules.length - remaining) / rules.length;
    displayProgress(rate);
  };

  decreaseRemaining();

  return await Promise.all(
    rules.map(async rule => {
      const ruleResult = (await rule.run(resourcesArn)).results;
      decreaseRemaining();

      return { rule, result: ruleResult };
    }),
  );
};
