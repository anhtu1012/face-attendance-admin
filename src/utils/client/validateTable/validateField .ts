/* eslint-disable @typescript-eslint/no-explicit-any */
import { store } from "@/lib/store";
import {
  addError,
  removeError,
  addItemError,
  removeItemError,
} from "@/lib/store/slices/validationErrorsSlice";
import { showError } from "@/hooks/useNotification";

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
  messageType?:
    | "required"
    | "containerNumberFormat"
    | "booleanType"
    | "numberType"
    | "dangerousCargo"
    | "overSizeCargo"
    | "specialOverSizeCargo"
    | "minimumValue",
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
      (typeof value === "string" && value.trim() === ""))
  ) {
    const errorMessage = createValidationMessage(
      field,
      messageType || "required",
      getMessage
    );
    isValid = false;
    addErrorToStore(errorMessage);
  }

  // Validate container number format
  const cntrNoRegex = /^[A-Za-z]{4}\d{7}$/; // 4 letters followed by 7 digits
  if (cntrNo === "cntrNo" && value && !cntrNoRegex.test(value as string)) {
    const formatErrorMsg = createValidationMessage(
      field,
      "containerNumberFormat",
      getMessage
    );
    isValid = false;
    addErrorToStore(formatErrorMsg);
    showError(formatErrorMsg);
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
  messageType:
    | "required"
    | "containerNumberFormat"
    | "booleanType"
    | "numberType"
    | "dangerousCargo"
    | "overSizeCargo"
    | "specialOverSizeCargo"
    | "minimumValue",
  getMessage?: (key: string, params?: Record<string, any>) => string,
  params?: Record<string, any>
): string => {
  if (getMessage) {
    try {
      const i18nMessage = getMessage(`validation.${messageType}`, {
        field,
        ...params,
      });
      if (i18nMessage && i18nMessage !== `validation.${messageType}`) {
        return i18nMessage;
      }
    } catch {}
  }

  const fallbackMessages = {
    required: `${field} không được để trống`,
    containerNumberFormat: `${field} phải có định dạng 4 chữ cái và 7 số`,
    booleanType: `${field} phải là giá trị boolean`,
    numberType: `${field} phải là số`,
    dangerousCargo: `${field} không được để trống cho hàng nguy hiểm có làm lạnh`,
    overSizeCargo: `${field} không được để trống cho hàng quá khổ`,
    specialOverSizeCargo: `${field} không được để trống cho hàng quá khổ đặc biệt`,
    minimumValue: `${field} phải có giá trị >= ${params?.minValue || 0}`,
  };

  return fallbackMessages[messageType];
};
