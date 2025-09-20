/* eslint-disable @typescript-eslint/no-explicit-any */
import { store } from "@/lib/store";
import {
  addError,
  removeError,
  addItemError,
  removeItemError,
} from "@/lib/store/slices/validationErrorsSlice";

export const validateField = (
  field: string,
  value: any,
  required: boolean,
  cntrNo?: string | undefined,
  type: "string" | "number" | "boolean" = "string",
  itemId?: string,
  getMessage?: (
    key: string,
    params?: Record<string, string | number>
  ) => string,
  messageType?: "required" | "booleanType" | "numberType" | "minimumValue",
  minValue?: number
): boolean => {
  let isValid = true;
  const fieldName = cntrNo || field;

  // Helper function để thêm error vào Redux store
  const addErrorToStore = (errorMessage: string) => {
    if (itemId) {
      store.dispatch(
        addItemError({
          itemId,
          error: {
            field: fieldName,
            message: errorMessage,
          },
        })
      );
    } else {
      store.dispatch(
        addError({
          field: fieldName,
          message: errorMessage,
        })
      );
    }
  };

  // Check for required fields
  if (
    required &&
    (value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "") ||
      (typeof value === "number" && isNaN(value)))
  ) {
    const errorMessage = createValidationMessage(
      field,
      messageType || "required",
      getMessage
    );
    console.log(`Validation failed for field ${field}:`, errorMessage);
    isValid = false;
    addErrorToStore(errorMessage);
  }

  // Validate data types
  if (type === "boolean" && typeof value !== "boolean") {
    const typeErrorMsg = createValidationMessage(
      field,
      "booleanType",
      getMessage
    );
    isValid = false;
    addErrorToStore(typeErrorMsg);
  }

  if (type === "number" && typeof value !== "number") {
    const typeErrorMsg = createValidationMessage(
      field,
      "numberType",
      getMessage
    );
    isValid = false;
    addErrorToStore(typeErrorMsg);
  }

  // Validate minimum value for numbers
  if (
    type === "number" &&
    typeof value === "number" &&
    minValue !== undefined &&
    value < minValue
  ) {
    const minValueErrorMsg = createValidationMessage(
      field,
      "minimumValue",
      getMessage,
      { minValue: minValue.toString() }
    );
    isValid = false;
    addErrorToStore(minValueErrorMsg);
  }

  // If field is valid, remove all errors for this field
  if (isValid) {
    if (itemId) {
      store.dispatch(removeItemError({ itemId, field: fieldName }));
    } else {
      store.dispatch(removeError(fieldName));
    }
  }

  return isValid;
};

// Helper function để tạo validation message với i18n
export const createValidationMessage = (
  field: string,
  messageType: "required" | "booleanType" | "numberType" | "minimumValue",
  getMessage?: (key: string, params?: Record<string, any>) => string,
  params?: Record<string, any>
): string => {
  if (getMessage) {
    try {
      const i18nMessage = getMessage(`validation.${messageType}`, {
        field,
        ...params,
      });
      // Only use i18n message if it exists and is valid
      if (i18nMessage && typeof i18nMessage === "string") {
        return i18nMessage;
      }
    } catch {
      // Silent fail and use fallback
    }
  }

  const fallbackMessages = {
    required: `${field} không được để trống`,
    booleanType: `${field} phải là giá trị boolean`,
    numberType: `${field} phải là số`,
    minimumValue: `${field} phải có giá trị >= ${params?.minValue || 0}`,
  };

  return fallbackMessages[messageType];
};
