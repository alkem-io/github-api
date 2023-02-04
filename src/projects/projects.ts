import XLSX from 'xlsx';
import { createConfigUsingEnvVars } from '../util/create-config-using-envvars';
import { GithubClient } from '../client/GithubCliClient';
import { createLogger } from '../util/create-logger';
import { extractFieldAndValue } from '../util/extract-field-and-value';
import { Epic } from './model/epic';
import { EpicField } from './epic.field';

const workbookTemplate = 'capacity-planning-template.xlsx';
const worksheetName = 'GITHUB_EPICS';

const main = async () => {
  await projects();
};

// todo: create new sheet per project
export const projects = async () => {
  const logger = createLogger();
  const config = createConfigUsingEnvVars();

  const githubClient = new GithubClient(config, logger);
  await githubClient.initialise();

  const { data: queryData } = await githubClient.projects('alkem-io', 4);
  const projectData = queryData?.organization?.projectV2;
  //const fieldData = projectData?.fields;
  const itemData = projectData?.items;
  // const fieldNames = fieldData?.nodes?.map(
  //   field => field?.name as string
  // ) as string[];

  const epics: Epic[] = [];
  const nodes = itemData?.nodes || [];
  for (const epicNode of nodes) {
    const epic = new Epic();

    const fieldNodes = epicNode?.fieldValues?.nodes || [];
    for (const fieldNode of fieldNodes) {
      const field = extractFieldAndValue(fieldNode);
      switch (field?.name) {
        case EpicField.PERIOD:
          epic.Period = field?.value;
          break;
        case EpicField.SPRINT:
          epic.Sprint = field?.value;
          break;
        case EpicField.LABELS:
          epic.Labels = field?.value;
          break;
        case EpicField.SPRINT_POINTS:
          epic.SprintPoints = field?.value;
          break;
        case EpicField.TITLE:
          epic.Title = field?.value;
          break;
        case EpicField.STATUS:
          epic.Status = field?.value;
          break;
        case EpicField.ASSIGNEES:
          epic.Assignees = field?.value;
          break;
        case EpicField.PARTNER:
          epic.Partner = field?.value;
          break;
        case EpicField.EPIC_POINTS:
          epic.EpicPoints = field?.value;
          break;
        case EpicField.REPOSITORY:
          epic.Repository = field?.value;
          break;
        case EpicField.RELEASE:
          epic.Release = field?.value;
          break;
        case EpicField.TYPE:
          epic.Type = field?.value;
          break;
        default:
          console.log(`not found: ${field?.name} - ${field?.value}`);
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
  //const epicsSheet = workbook.Sheets[worksheetName];
  workbook.Sheets[worksheetName] = XLSX.utils.json_to_sheet(epics);
  XLSX.writeFile(workbook, workbookName);

  return queryData;
};

main().catch(error => {
  console.error(error);
});
