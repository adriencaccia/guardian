import { ARN } from '@aws-sdk/util-arn-parser';
import { fetchAllLambdaConfigurations } from '../../helpers';
import { Category, CheckResult, Rule } from '../../types';

const DEFAULT_MEMORY_SIZE = 1024;

const run = async (
  resourceArns: ARN[],
): Promise<{
  results: CheckResult[];
}> => {
  const lambdaConfigurations = await fetchAllLambdaConfigurations(resourceArns);

  const results = lambdaConfigurations.map(lambdaConfiguration => ({
    arn: lambdaConfiguration.FunctionArn ?? '',
    memory: lambdaConfiguration.MemorySize,
    success: lambdaConfiguration.MemorySize !== DEFAULT_MEMORY_SIZE,
  }));

  return { results };
};

export default {
  ruleName: 'Lambda: No Default Memory',
  errorMessage: 'The following functions have their memory set as default',
  run,
  fileName: 'noDefaultMemory',
  categories: [Category.GREEN_IT, Category.IT_COSTS],
} as Rule;
