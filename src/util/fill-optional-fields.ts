import { getHeaders } from './get-headers';

/***
 * Defines the optional fields as undefined,
 * so the sheet is populated correctly every time
 */
export const fillOptionalFields = <T extends Record<string, unknown>>(
  array: T[]
) => {
  // for each object in the array put the keys in a new array
  // flatten that array
  // there will be duplicate names which can be removed with Set
  // turn it back into an array
  const uniqKeys: (keyof T)[] = getHeaders(array);
  // process the original data into a new array
  // first entry will define row headers in Excel sheet
  return array.map<T>(epic => {
    return uniqKeys.reduce<T>((acc, key) => {
      acc[key] = epic[key];
      return acc;
    }, {} as T);
  });
};
