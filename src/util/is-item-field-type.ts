import {
  ProjectV2ItemFieldDateValue,
  ProjectV2ItemFieldIterationValue,
  ProjectV2ItemFieldLabelValue,
  ProjectV2ItemFieldMilestoneValue,
  ProjectV2ItemFieldNumberValue,
  ProjectV2ItemFieldPullRequestValue,
  ProjectV2ItemFieldRepositoryValue,
  ProjectV2ItemFieldReviewerValue,
  ProjectV2ItemFieldSingleSelectValue,
  ProjectV2ItemFieldTextValue,
  ProjectV2ItemFieldUserValue,
} from '../generated/graphql';

export const isProjectV2ItemFieldDateValue = (
  node: unknown
): node is ProjectV2ItemFieldDateValue => {
  return !!(node as ProjectV2ItemFieldDateValue).date;
};

export const isProjectV2ItemFieldIterationValue = (
  node: unknown
): node is ProjectV2ItemFieldIterationValue => {
  return !!(node as ProjectV2ItemFieldIterationValue).startDate;
};

export const isProjectV2ItemFieldLabelValue = (
  node: unknown
): node is ProjectV2ItemFieldLabelValue => {
  return !!(node as ProjectV2ItemFieldLabelValue).labels;
};

export const isProjectV2ItemFieldRepositoryValue = (
  node: unknown
): node is ProjectV2ItemFieldRepositoryValue => {
  return !!(node as ProjectV2ItemFieldRepositoryValue).repository;
};

export const isProjectV2ItemFieldMilestoneValue = (
  node: unknown
): node is ProjectV2ItemFieldMilestoneValue => {
  return !!(node as ProjectV2ItemFieldMilestoneValue).milestone;
};

export const isProjectV2ItemFieldNumberValue = (
  node: unknown
): node is ProjectV2ItemFieldNumberValue => {
  return !!(node as ProjectV2ItemFieldNumberValue).number;
};

export const isProjectV2ItemFieldPullRequestValue = (
  node: unknown
): node is ProjectV2ItemFieldPullRequestValue => {
  return !!(node as ProjectV2ItemFieldMilestoneValue).milestone;
};

export const isProjectV2ItemFieldReviewerValue = (
  node: unknown
): node is ProjectV2ItemFieldReviewerValue => {
  return !!(node as ProjectV2ItemFieldReviewerValue).reviewers;
};

export const isProjectV2ItemFieldSingleSelectValue = (
  node: unknown
): node is ProjectV2ItemFieldSingleSelectValue => {
  return !!(node as ProjectV2ItemFieldSingleSelectValue).name;
};

export const isProjectV2ItemFieldTextValue = (
  node: unknown
): node is ProjectV2ItemFieldTextValue => {
  return !!(node as ProjectV2ItemFieldTextValue).text;
};

export const isProjectV2ItemFieldUserValue = (
  node: unknown
): node is ProjectV2ItemFieldUserValue => {
  return !!(node as ProjectV2ItemFieldUserValue).users;
};
