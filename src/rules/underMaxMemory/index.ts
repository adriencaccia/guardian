import { FunctionConfiguration } from '@aws-sdk/client-lambda';
import { ARN } from '@aws-sdk/util-arn-parser';
import { AWS_HISTORICAL_MAX_MEMORY } from '../../constants';
import { fetchAllLambdaConfigurations } from '../../helpers';
import { Category, CheckResult, Rule } from '../../types';

const hasMemoryUnderMaxMemory = (lambdaConfiguration: FunctionConfiguration) =>
  lambdaConfiguration.MemorySize === undefined ||
  lambdaConfiguration.MemorySize < AWS_HISTORICAL_MAX_MEMORY;
const run = async (
  resourceArns: ARN[],
): Promise<{
  results: CheckResult[];
}> => {
  const lambdaConfigurations = await fetchAllLambdaConfigurations(resourceArns);

  const results = lambdaConfigurations.map(lambdaConfiguration => ({
    arn: lambdaConfiguration.FunctionArn ?? '',
    success: hasMemoryUnderMaxMemory(lambdaConfiguration),
    memorySize: lambdaConfiguration.MemorySize,
  }));

  return { results };
};

export default {
  ruleName: 'Lambda: Under Maximum Memory',
  errorMessage: `The function's memory is set to the historical maximum limit of ${AWS_HISTORICAL_MAX_MEMORY} MB or higher`,
  run,
  fileName: 'underMaxMemory',
  categories: [Category.GREEN_IT, Category.IT_COSTS],
} as Rule;
