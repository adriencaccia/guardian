import { Rule } from './Rule';

export type CheckResult = { arn: string; success: boolean } & Record<
  string,
  unknown
>;

export type ChecksResults = {
  rule: Rule;
  result: CheckResult[];
}[];

export type FailedRule = {
  rule: Rule;
  extras: Record<string, unknown>;
};

export type ResourceResult = {
  resourceArn: string;
  failedRules: FailedRule[];
};

export enum Category {
  GREEN_IT = 'GREEN_IT',
  STABILITY = 'STABILITY',
  SPEED = 'SPEED',
  IT_COSTS = 'IT_COSTS',
  SECURITY = 'SECURITY',
}

export const CategoryNames = {
  [Category.GREEN_IT]: 'Green IT',
  [Category.STABILITY]: 'Stability',
  [Category.SPEED]: 'Speed',
  [Category.IT_COSTS]: 'IT costs',
  [Category.SECURITY]: 'Security',
};

export type ChecksResultsByCategory = Record<Category, number>;
