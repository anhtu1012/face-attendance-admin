import { ItemErrors } from "@/lib/store/slices/validationErrorsSlice";
import { useCallback } from "react";

/**
 * A utility function that collects all error messages for a specific item
 *
 * @param itemId The unique identifier of the item
 * @param itemErrorsFromRedux The array of validation errors from Redux store
 * @returns A string containing all error messages separated by new lines
 */
export const collectErrorMessagesForItem = (
  itemId: string,
  itemErrorsFromRedux: ItemErrors[]
): string => {
  if (!itemErrorsFromRedux || !Array.isArray(itemErrorsFromRedux)) return "";

  const itemErrorObj = itemErrorsFromRedux.find(
    (item) => item && item.itemId === itemId
  );

  if (!itemErrorObj || !Array.isArray(itemErrorObj.errors)) return "";

  // Join all error messages for the item
  return itemErrorObj.errors.map((err) => `- ${err.message}`).join("\n");
};

/**
 * React hook version of collectErrorMessagesForItem
 *
 * @param itemErrorsFromRedux The array of validation errors from Redux store
 * @returns A callback function that collects error messages for a specific item
 */
export const useCollectErrorMessagesForItem = (
  itemErrorsFromRedux: ItemErrors[]
) => {
  return useCallback(
    (itemId: string): string => {
      return collectErrorMessagesForItem(itemId, itemErrorsFromRedux);
    },
    [itemErrorsFromRedux]
  );
};
