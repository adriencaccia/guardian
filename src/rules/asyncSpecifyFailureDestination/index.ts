import { ARN, parse } from '@aws-sdk/util-arn-parser';
import {
  fetchAllAsyncLambdasArns,
  fetchAllLambdaInvokeEventConfigs,
} from '../../helpers';
import { Category, Rule } from '../../types';

const run = async (resourceArns: ARN[]) => {
  const asyncLambdasArns = await fetchAllAsyncLambdasArns(resourceArns);

  const invokeConfigs = await fetchAllLambdaInvokeEventConfigs(
    asyncLambdasArns.map(parse),
  );

  const results = invokeConfigs.map(({ arn, config }) => ({
    arn,
    success: config?.DestinationConfig?.OnFailure?.Destination !== undefined,
  }));

  return { results };
};

export default {
  ruleName: 'Lambda: Specify Failure Destination for Async Functions',
  errorMessage:
    'The function is asynchronous but has no failure destination set',
  run,
  fileName: 'asyncSpecifyFailureDestination',
  categories: [Category.STABILITY],
} as Rule;
