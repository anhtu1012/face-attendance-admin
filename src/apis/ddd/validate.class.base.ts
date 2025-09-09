import { ZodError, ZodSchema } from "zod";
import { ServiceResponse } from "./serviceResponse";

export class ValidateBaseClass {
  static async validate<T extends object>(
    formData: T,
    typeForm: ZodSchema,
    isFormatMessage = true
  ) {
    try {
      await typeForm.parse(formData);
    } catch (err) {
      let errorMessage = "";
      let errorObject = null;

      if (err instanceof ZodError) {
        const errors = (err as ZodError).errors;

        if (!isFormatMessage) {
          errorMessage = `Lỗi: ${errors.map((e) => e.message).join(", ")}`;
        } else {
          errorMessage = `Lỗi: ${errors.map((e) => `${e.message}`).join(", ")}`;
        }

        // Create error object with field-specific messages
        errorObject = errors.reduce((obj, e) => {
          if (e.path.length > 0) {
            const fieldName = e.path.at(-1);
            obj[fieldName as string] = e.message;
          }
          return obj;
        }, {} as Record<string, string>);
      }

      const serviceResponse = ServiceResponse.failure(
        errorMessage,
        null,
        errorObject
      );
      throw serviceResponse;
    }
  }
}
