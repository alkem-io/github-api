import { ColInfo } from 'xlsx';

export const getColumnConfig = <T extends Record<string, unknown>>(
  array: T[]
): ColInfo[] => {
  const objectMaxLength: number[] = [];
  for (let i = 0; i < array.length; i++) {
    const values = Object.values<unknown>(array[i]);
    for (let j = 0; j < values.length; j++) {
      if (typeof values[j] === 'number') {
        objectMaxLength[j] = 10;
      } else if (typeof values[j] === 'string') {
        objectMaxLength[j] =
          objectMaxLength[j] >= (values[j] as string).length
            ? objectMaxLength[j]
            : (values[j] as string).length;
      }
    }
  }

  return objectMaxLength.map<ColInfo>(x => ({
    width: x,
  }));
};
