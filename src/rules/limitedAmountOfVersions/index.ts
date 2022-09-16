import { ARN } from '@aws-sdk/util-arn-parser';
import { fetchAllLambdaVersions } from '../../helpers';
import { CheckResult, Rule } from '../../types';

const MAX_AMOUNT_OF_VERSIONS = 3 + 1; // +$latest

const run = async (resources: ARN[]): Promise<{ results: CheckResult[] }> => {
  const lambdaVersions = await fetchAllLambdaVersions(resources);

  const results = lambdaVersions.map(({ arn, versions }) => ({
    arn,
    success: versions.length <= MAX_AMOUNT_OF_VERSIONS,
    versionAmount: versions.length,
  }));

  return { results };
};

export default {
  ruleName: 'Lambda: Limited Amount of Versions',
  errorMessage:
    'The following functions have an amount of deployed versions greater than 3',
  run,
  fileName: 'limitedAmountOfVersions',
} as Rule;
