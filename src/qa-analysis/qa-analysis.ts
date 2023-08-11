import XLSX from 'xlsx';
import { createConfigUsingEnvVars } from '../util/create-config-using-envvars';
import { GithubClient } from '../client/GithubCliClient';
import {
  createLogger,
  getColumnConfig,
  extractFieldAndValue,
  fillOptionalFields,
} from '../util';
import { EpicField } from './epic.field';
import { EpicType } from './model/epic';
const workbookTemplate = 'qa-analysis-template.xlsx';
const worksheetName = 'GITHUB_EPICS';
const projectID = 15; // visible in the github projects URL: https://github.com/orgs/alkem-io/projects/15/views/1
const alkemioOrganizationName = 'alkem-io';

const main = async () => {
  await projects();
};

// todo: create new sheet per project
export const projects = async () => {
  const logger = createLogger();
  const config = createConfigUsingEnvVars();

  const githubClient = new GithubClient(config, logger);
  await githubClient.initialise();

  const fieldData = [];
  const itemData = [];

  let endCursor: string | undefined;
  let hasNextPage: boolean;

  do {
    const { data } = await githubClient.projectItems(
      alkemioOrganizationName,
      projectID,
      endCursor
    );
    endCursor = data?.organization?.projectV2?.items?.pageInfo?.endCursor;
    hasNextPage = Boolean(
      data?.organization?.projectV2?.items?.pageInfo?.hasNextPage
    );

    const { fields, items } = data?.organization?.projectV2 ?? {};

    if (fields?.nodes) {
      fieldData.push(...fields.nodes);
    }
    if (items?.nodes) {
      itemData.push(...items.nodes);
    }
  } while (hasNextPage);

  logger.info(`...retrieved ${itemData.length} epics`);

  if (!fieldData) {
    throw new Error('Fields not found');
  }

  if (!itemData) {
    throw new Error('Items not found');
  }

  const epics: EpicType[] = [];
  for (const itemNode of itemData) {
    const epic: EpicType = {};

    const fieldNodes = itemNode?.fieldValues?.nodes || [];
    for (const fieldNode of fieldNodes) {
      const field = extractFieldAndValue(fieldNode);

      if (!field) {
        throw new Error(
          `Unable to get field and value for: ${JSON.stringify(fieldNode)}`
        );
      }

      switch (field.name) {
        case EpicField.PERIOD:
          epic.Period = field.value;
          break;
        case EpicField.SPRINT:
          epic.Sprint = field.value;
          break;
        case EpicField.LABELS:
          epic.Labels = field.value;
          break;
        case EpicField.SPRINT_POINTS:
          epic.SprintPoints = parseInt(field.value);
          break;
        case EpicField.TITLE:
          epic.Title = field.value;
          break;
        case EpicField.STATUS:
          epic.Status = field.value;
          break;
        case EpicField.ASSIGNEES:
          epic.Assignees = field.value;
          break;
        case EpicField.PARTNER:
          epic.Partner = field.value;
          break;
        case EpicField.EPIC_POINTS:
          epic.EpicPoints = parseInt(field.value);
          break;
        case EpicField.REPOSITORY:
          epic.Repository = field.value;
          break;
        case EpicField.RELEASE:
          epic.Release = field.value;
          break;
        case EpicField.TYPE:
          epic.Type = field.value;
          break;
        case EpicField.Milestone:
          epic.Milestone = field.value;
          break;
        default:
          console.error(`not found: ${field.name} - ${field.value}`);
      }
    }
    epics.push(epic);
  }

  if (epics.length === 0) {
    throw new Error('no work items found');
  }

  const date = new Date();
  const dateStr = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  const workbookName = workbookTemplate.replace('template', dateStr);

  const workbook = XLSX.readFile(workbookTemplate);
  const epicsSheet = workbook.Sheets[worksheetName];

  const newEpics = fillOptionalFields(epics);
  const colInfo = getColumnConfig(newEpics);

  XLSX.utils.sheet_add_json(epicsSheet, newEpics);
  epicsSheet['!cols'] = colInfo;
  XLSX.writeFile(workbook, workbookName);
};

main().catch(error => {
  console.error(error);
});
