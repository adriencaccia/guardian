import {
  FunctionConfiguration,
  LambdaClient,
  ListVersionsByFunctionCommandInput,
  paginateListFunctions,
  paginateListVersionsByFunction,
} from '@aws-sdk/client-lambda';
import {
  CloudFormationClient,
  ListStackResourcesCommand,
} from '@aws-sdk/client-cloudformation';

process.env.AWS_PROFILE = 'fredericb-programmatic';
const client = new LambdaClient({});

export const fetchLambdaVersions = async ({
  FunctionName,
}: Pick<ListVersionsByFunctionCommandInput, 'FunctionName'>): Promise<
  FunctionConfiguration[]
> => {
  const functionVersions: FunctionConfiguration[] = [];
  for await (const page of paginateListVersionsByFunction(
    { client },
    { FunctionName },
  )) {
    functionVersions.push(...(page.Versions ?? []));
  }

  return functionVersions;
};

export const fetchLambdas = async (): Promise<FunctionConfiguration[]> => {
  const functions: FunctionConfiguration[] = [];
  for await (const page of paginateListFunctions({ client }, {})) {
    functions.push(...(page.Functions ?? []));
  }

  return functions;
};

export const execute = async (): Promise<void> => {
  const cloudFormationClient = new CloudFormationClient({});
  const resources = await cloudFormationClient.send(
    new ListStackResourcesCommand({
      StackName: 'votim-dev',
    }),
  );
  console.log(resources);
  // const functions = await fetchLambdas();
  // console.log(functions);
};
