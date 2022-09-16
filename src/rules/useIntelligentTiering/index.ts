import { IntelligentTieringConfiguration } from '@aws-sdk/client-s3';
import { ARN, build } from '@aws-sdk/util-arn-parser';
import { fetchAllS3BucketIntelligentTieringConfigurations } from '../../helpers';
import { filterS3BucketFromResources } from '../../helpers/filterS3BucketFromResources';
import { CheckResult, Rule } from '../../types';

const hasIntelligentTiering = (
  configuration: IntelligentTieringConfiguration[] | undefined,
): boolean => configuration?.some(item => item.Status === 'Enabled') ?? false;

const run = async (
  resources: ARN[],
): Promise<{
  results: CheckResult[];
}> => {
  const buckets = filterS3BucketFromResources(resources);
  const s3BucketConfigurations =
    await fetchAllS3BucketIntelligentTieringConfigurations(buckets);
  const results = s3BucketConfigurations.map(({ arn, configuration }) => ({
    arn: build(arn),
    success: hasIntelligentTiering(configuration),
  }));

  return { results };
};

export default {
  ruleName: 'S3: Use Intelligent Tiering',
  errorMessage: 'Intelligent Tiering is not enabled on this S3 bucket',
  run,
  fileName: 'useIntelligentTiering',
} as Rule;
