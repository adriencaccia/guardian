import { FunctionConfiguration } from '@aws-sdk/client-lambda';
import { ARN } from '@aws-sdk/util-arn-parser';
import { fetchAllLambdaConfigurations } from '../../helpers';
import { CheckResult, Rule } from '../../types';

const isLambdaRoleShared = (
  lambdaConfiguration: FunctionConfiguration,
  sharedRoles: (string | undefined)[],
) => sharedRoles.includes(lambdaConfiguration.Role);

const run = async (
  resourceArns: ARN[],
): Promise<{
  results: CheckResult[];
}> => {
  const lambdaConfigurations = await fetchAllLambdaConfigurations(resourceArns);
  const roles = lambdaConfigurations.map(
    lambdaConfiguration => lambdaConfiguration.Role,
  );
  const sharedRoles = roles.filter(
    role => roles.filter(r => r === role).length > 1,
  );
  const results = lambdaConfigurations.map(lambdaConfiguration => ({
    arn: lambdaConfiguration.FunctionArn ?? '',
    success: !isLambdaRoleShared(lambdaConfiguration, sharedRoles),
    role: lambdaConfiguration.Role,
  }));

  return { results };
};

export default {
  ruleName: 'Lambda: No Shared IAM Roles',
  errorMessage:
    'The following functions have roles used by 1 or more other functions',
  run,
  fileName: 'noSharedIamRoles',
} as Rule;
