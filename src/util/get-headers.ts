export const getHeaders = <T extends Record<string, unknown>>(array: T[]) => {
  return Array.from(new Set(array.map(o => Object.keys(o)).flat()));
};
