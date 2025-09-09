/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Checks if a value already exists in a dataset for a specific field
 *
 * @param data Array of data objects to check against
 * @param keyField The field key to check for duplicates
 * @param value The value to check for duplicates
 * @param record Optional current record (for edit operations)
 * @returns Promise<boolean> - true if duplicate found
 */
export const checkDuplicates = async <T extends object>(
  data: T[],
  keyField: keyof T,
  value: any,
  record?: T
): Promise<boolean> => {
  // If we're editing and the value hasn't changed, it's not a duplicate
  if (record && record[keyField] === value) {
    return false;
  }

  // Check if any item in the data array has the same value for the specified key
  return data.some((item) => item[keyField] === value);
};

/**
 * Sets form field errors based on an error object
 *
 * @param form Ant Design form instance
 * @param error Error object containing field errors
 * @returns boolean - true if any errors were handled
 */
export const handleFormErrors = <T extends object>(
  form: any,
  error: any
): boolean => {
  if (error && error.error && typeof error.error === "object") {
    const fieldErrors: Record<
      string,
      { validateStatus: string; help: string }
    > = {};

    Object.keys(error.error).forEach((field) => {
      fieldErrors[field] = {
        validateStatus: "error",
        help: error.error[field],
      };
    });

    form.setFields(
      Object.entries(fieldErrors).map(([name, errors]: [string, any]) => ({
        name: name as keyof T,
        errors: [errors.help],
      }))
    );

    return Object.keys(error.error).length > 0;
  }

  return false;
};

/**
 * Validates form field uniqueness and sets error if duplicate
 *
 * @param form Ant Design form instance
 * @param data Dataset to check against
 * @param field Field name to check
 * @param value Value to check for duplicates
 * @param errorMessage Error message to display if duplicate
 * @param record Optional record for edit operations
 * @returns boolean - true if duplicate found
 */
export const validateUniqueness = async <T extends object>(
  form: any,
  data: T[],
  field: keyof T,
  value: any,
  errorMessage: string,
  record?: T
): Promise<boolean> => {
  const isDuplicate = await checkDuplicates(data, field, value, record);

  if (isDuplicate) {
    form.setFields([
      {
        name: field,
        errors: [errorMessage],
      },
    ]);
    return true;
  }

  return false;
};
