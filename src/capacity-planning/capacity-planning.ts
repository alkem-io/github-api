import XLSX from 'xlsx';
import { createConfigUsingEnvVars } from '../util/create-config-using-envvars';
import { GithubClient } from '../client/GithubCliClient';
import {
  createLogger,
  getColumnConfig,
  extractFieldAndValue,
  fillOptionalFields,
} from '../util';
import { EpicType } from './model/epic';
import { EpicField, CAPACITY_PLANNING_COLUMN_ORDER } from './epic.field';
const workbookTemplate = 'capacity-planning-template.xlsx';
const worksheetName = 'GITHUB_EPICS';
const projectID = 4;
const alkemioOrganizationName = 'alkem-io';

// Convert an ISO date string (YYYY-MM-DD) into "YYYY Q#" format. If input not a valid date pattern, return original.
const toYearQuarter = (dateStr?: string): string | undefined => {
  if (!dateStr) return dateStr;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return dateStr; // Not an ISO date in expected format
  const year = match[1];
  const month = parseInt(match[2], 10);
  if (month < 1 || month > 12) return dateStr;
  const quarter = Math.floor((month - 1) / 3) + 1;
  return `${year} Q${quarter}`;
};

const main = async () => {
  await projectItems();
};

// todo: create new sheet per project
export const projectItems = async () => {
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
        logger.error(
          `Unable to get field and value for: ${JSON.stringify(fieldNode)}`
        );
        continue;
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
        case EpicField.EPIC_POINTS_REMAINING:
          epic.EpicPointsRemaining = parseInt(field.value);
          break;
        case EpicField.EPIC_POINTS_DONE:
          epic.EpicPointsDone = parseInt(field.value);
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
        case EpicField.MILESTONE:
          epic.Milestone = field.value;
          break;
        case EpicField.QUARTILE:
          // Original value appears as an ISO date (e.g. 2025-10-01); transform to fiscal quarter representation.
          epic.Quartile = toYearQuarter(field.value);
          break;
        case EpicField.TYPE_ALKEMIO:
          epic.TypeAlkemio = field.value;
          break;
        case EpicField.NON_FUNCTIONAL_AREA:
          epic.NonFunctionalArea = field.value;
          break;
        case EpicField.FUNCTIONAL_AREA:
          epic.FunctionalArea = field.value;
          break;
        case EpicField.FEATURE:
          epic.Feature = field.value;
          break;
        case EpicField.ORDER:
          epic.Order = parseInt(field.value);
          break;
        case EpicField.NEW_IMPROVEMENT:
          epic.NewImprovement = field.value;
          break;
        case EpicField.NEW_IMPROVEMENT:
          epic.NewImprovement = field.value;
          break;
        case EpicField.CLASSIFICATION:
          epic.Classification = field.value;
          break;
        case EpicField.FEATURE_2:
          epic.Feature2 = field.value;
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

  // Write data manually starting at row 2 to preserve template header formatting and formulas.
  // We avoid overwriting cells that contain formulas (cell.f) to keep computed fields intact.
  const startRow = 2; // 1-based Excel row index, row 1 assumed to contain headers in template

  const colLetters = ((): string[] => {
    const toCol = (index: number) => {
      let s = '';
      let n = index;
      while (n >= 0) {
        s = String.fromCharCode((n % 26) + 65) + s;
        n = Math.floor(n / 26) - 1;
      }
      return s;
    };
    return CAPACITY_PLANNING_COLUMN_ORDER.map((_, i) => toCol(i));
  })();

  const setCellValue = (addr: string, value: unknown) => {
    if (value === undefined || value === null || value === '') return;
    const existing = epicsSheet[addr];
    if (existing && (existing as any).f) {
      // Has a formula; skip to preserve
      return;
    }
    // Reuse existing cell object if present to keep any style metadata (SheetJS community version does not preserve styles, but we try)
    const cell = existing || {};
    if (typeof value === 'number') {
      cell.v = value;
      cell.t = 'n';
    } else if (value instanceof Date) {
      cell.v = value;
      cell.t = 'd';
    } else if (Array.isArray(value)) {
      cell.v = value.join(', ');
      cell.t = 's';
    } else {
      cell.v = value as string;
      cell.t = 's';
    }
    epicsSheet[addr] = cell;
  };

  newEpics.forEach((epic, rowIndex) => {
    const excelRow = startRow + rowIndex;
    CAPACITY_PLANNING_COLUMN_ORDER.forEach((header, colIndex) => {
      const col = colLetters[colIndex];
      const addr = `${col}${excelRow}`;
      // The epic object keys match header text (Title, Status, etc.)
      const value = (epic as Record<string, unknown>)[header];
      setCellValue(addr, value);
    });
  });

  // Update sheet range so Excel displays newly added cells.
  if (newEpics.length > 0) {
    const lastCol = colLetters[colLetters.length - 1];
    const lastRow = startRow + newEpics.length - 1;
    const newRef = `A1:${lastCol}${lastRow}`;
    epicsSheet['!ref'] = newRef; // overwrite; template range was smaller.
  }
  epicsSheet['!cols'] = colInfo;
  // Attempt to write the file; if locked (EBUSY) append timestamp to create a new one
  try {
    XLSX.writeFile(workbook, workbookName);
  } catch (err: any) {
    if (err?.code === 'EBUSY') {
      const altName = workbookName.replace(/\.xlsx$/, `-${Date.now()}.xlsx`);
      console.warn(
        `Primary workbook locked (${workbookName}); writing alternative file: ${altName}`
      );
      XLSX.writeFile(workbook, altName);
    } else {
      throw err;
    }
  }
};

main().catch(error => {
  console.error(error);
});
