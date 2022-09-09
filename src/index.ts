import intersectionWith from 'lodash/intersectionWith';
import Progress from 'cli-progress';
import {
  fetchCloudFormationResourceArns,
  fetchTaggedResourceArns,
} from './helpers';
import {
  AsyncSpecifyFailureDestination,
  LightBundleRule,
  LimitedAmountOfLambdaVersions,
  noDefaultMemory,
  NoIdenticalCode,
  NoMaxTimeout,
  NoSharedIamRoles,
  SpecifyDlqOnSqs,
  UnderMaxMemory,
  UseArm,
  UseIntelligentTiering,
} from './rules';
import { ChecksResults, Options, Rule, Tag } from './types';
import { displayError } from './display';

const fetchResourceArns = async (
  cloudformationStacks: string[] | undefined,
  tags: Tag[] | undefined,
) => {
  try {
    const resourcesFetchedByTags = await fetchTaggedResourceArns(tags ?? []);

    if (cloudformationStacks === undefined) {
      return resourcesFetchedByTags;
    }

    const resourcesFetchedByStack = await fetchCloudFormationResourceArns(
      cloudformationStacks,
    );

    const resources = intersectionWith(
      resourcesFetchedByStack,
      resourcesFetchedByTags,
      (arnA, arnB) =>
        arnA.resource === arnB.resource && arnA.service === arnB.service,
    );

    return resources;
  } catch {
    displayError(
      `Unable to fetch AWS resources, check that the profile "${
        process.env.AWS_PROFILE ?? ''
      }" is correctly set or specify another profile using -p option`,
    );
    process.exit(1);
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const runGuardianChecks = async ({
  cloudformationStacks,
  tags,
}: Options): Promise<ChecksResults> => {
  const resourceArns = await fetchResourceArns(cloudformationStacks, tags);
  const rules: Rule[] = [
    LightBundleRule,
    NoIdenticalCode,
    noDefaultMemory,
    NoMaxTimeout,
    NoSharedIamRoles,
    UseArm,
    UseIntelligentTiering,
    LimitedAmountOfLambdaVersions,
    UnderMaxMemory,
    AsyncSpecifyFailureDestination,
    SpecifyDlqOnSqs,
  ];

  const total = rules.length + 1;

  const progressBar = new Progress.SingleBar({}, Progress.Presets.rect);
  progressBar.start(total, 0);

  const decreaseRemaining = () => {
    progressBar.increment();
  };

  decreaseRemaining();

  const results = await Promise.all(
    rules.map(async rule => {
      const ruleResult = (await rule.run(resourceArns)).results;
      decreaseRemaining();

      return { rule, result: ruleResult };
    }),
  );

  progressBar.stop();

  return results;
};
