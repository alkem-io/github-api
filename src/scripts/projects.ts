import XLSX from 'xlsx';
import { createConfigUsingEnvVars } from '../util/create-config-using-envvars';
import { GithubClient } from '../client/GithubCliClient';
import { createLogger } from '../util/create-logger';
import { extractFieldAndValue } from '../util/extract-field-and-value';

const workbookName = 'capacity-planning-template.xlsx';
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
  const fieldData = projectData?.fields;
  const itemData = projectData?.items;
  const fieldNames = fieldData?.nodes?.map(
    field => field?.name as string
  ) as string[];

  const items = itemData?.nodes?.map(item =>
    item?.fieldValues?.nodes?.reduce((acc, fieldObject) => {
      if (!fieldObject) {
        return acc;
      }

      const fields = extractFieldAndValue(fieldObject);

      if (!fields) {
        return acc;
      }

      return {
        ...acc,
        ...fields,
      };
    }, {})
  );

  if (!items) {
    throw new Error('no work items found');
  }

  // todo: remove columns from fieldNames if the whole column is empty

  const workbook = XLSX.readFile(workbookName);
  workbook.Sheets[worksheetName] = XLSX.utils.json_to_sheet(items, {
    header: fieldNames,
  });
  XLSX.writeFile(workbook, workbookName);

  return queryData;
};

main().catch(error => {
  console.error(error);
});


