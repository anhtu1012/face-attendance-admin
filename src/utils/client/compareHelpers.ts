/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Compare form values with original record and return changed fields
 * @param values The current form values
 * @param record The original record values
 * @returns Object containing only changed values
 */
export function getChangedValues<T extends Record<string, any>>(
  values: T,
  record: T
): Partial<T> {
  const changedValues: Partial<T> = {};

  Object.keys(values).forEach((key) => {
    const k = key as keyof T;
    if (values[k] !== record[k]) {
      changedValues[k] = values[k];
    }
  });

  return changedValues;
}
