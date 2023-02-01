import { User } from '../generated/graphql';
import {
  isProjectV2ItemFieldDateValue,
  isProjectV2ItemFieldIterationValue,
  isProjectV2ItemFieldLabelValue,
  isProjectV2ItemFieldRepositoryValue,
  isProjectV2ItemFieldNumberValue,
  isProjectV2ItemFieldMilestoneValue,
  isProjectV2ItemFieldPullRequestValue,
  isProjectV2ItemFieldReviewerValue,
  isProjectV2ItemFieldSingleSelectValue,
  isProjectV2ItemFieldTextValue,
  isProjectV2ItemFieldUserValue,
} from './is-item-field-type';

/***
 * Returns an object with a single key, value pair -
 * the fields name as a key and the value as the value
 * or undefined if the item field is not recognized
 */
export const extractFieldAndValue = (fieldObject: unknown) => {
  if (isProjectV2ItemFieldDateValue(fieldObject)) {
    return {
      [fieldObject.field.name]: fieldObject.date,
    };
  } else if (isProjectV2ItemFieldIterationValue(fieldObject)) {
    return {
      [fieldObject.field.name]: fieldObject.startDate,
    };
  } else if (isProjectV2ItemFieldLabelValue(fieldObject)) {
    return {
      [fieldObject.field.name]: fieldObject.labels?.nodes
        ?.map(x => x?.name ?? 'label')
        ?.join(','),
    };
  } else if (isProjectV2ItemFieldRepositoryValue(fieldObject)) {
    return {
      [fieldObject.field.name]: fieldObject?.repository?.name ?? 'repoName',
    };
  } else if (isProjectV2ItemFieldMilestoneValue(fieldObject)) {
    return {
      [fieldObject.field.name]: fieldObject?.milestone?.title ?? 'milestone',
    };
  } else if (isProjectV2ItemFieldNumberValue(fieldObject)) {
    return {
      [fieldObject.field.name]: fieldObject.number,
    };
  } else if (isProjectV2ItemFieldPullRequestValue(fieldObject)) {
    return {
      [fieldObject.field.name]: fieldObject.pullRequests?.nodes
        ?.map(pr => pr?.title ?? 'PR')
        .join(','),
    };
  } else if (isProjectV2ItemFieldReviewerValue(fieldObject)) {
    return {
      [fieldObject.field.name]: fieldObject.reviewers?.nodes
        ?.map(r => (r as User)?.name ?? 'reviewer')
        .join(','),
    };
  } else if (isProjectV2ItemFieldSingleSelectValue(fieldObject)) {
    return {
      [fieldObject.field.name]: fieldObject.name,
    };
  } else if (isProjectV2ItemFieldTextValue(fieldObject)) {
    return {
      [fieldObject.field.name]: fieldObject.text,
    };
  } else if (isProjectV2ItemFieldUserValue(fieldObject)) {
    return {
      [fieldObject.field.name]: fieldObject.users?.nodes
        ?.map(user => user?.name ?? 'user')
        .join(','),
    };
  }

  return undefined;
};
