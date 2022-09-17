import { FunctionConfiguration } from '@aws-sdk/client-lambda';
import { ARN } from '@aws-sdk/util-arn-parser';
import { fetchAllLambdaConfigurations } from '../../helpers';
import { Category, CheckResult, Rule } from '../../types';

const ARM_ARCHITECTURE = 'arm64';

const isArmArchitecture = (
  lambdaConfigurations: FunctionConfiguration,
): boolean =>
  lambdaConfigurations.Architectures
    ? lambdaConfigurations.Architectures[0] === ARM_ARCHITECTURE
    : false;

const run = async (
  resourceArns: ARN[],
): Promise<{
  results: CheckResult[];
}> => {
  const lambdaConfigurations = await fetchAllLambdaConfigurations(resourceArns);
  const results = lambdaConfigurations.map(lambdaConfiguration => ({
    arn: lambdaConfiguration.FunctionArn ?? '',
    success: isArmArchitecture(lambdaConfiguration),
  }));

  return { results };
};

export default {
  ruleName: 'Lambda: Use an ARM Architecture',
  errorMessage: "The function's architecture is not set as ARM",
  run,
  fileName: 'useArm',
  categories: [Category.GREEN_IT, Category.IT_COSTS, Category.SPEED],
} as Rule;
