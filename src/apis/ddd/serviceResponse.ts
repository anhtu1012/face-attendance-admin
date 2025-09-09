/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

export class ServiceResponse<T = null> {
  readonly success: boolean;
  readonly message: string | string[];
  readonly responseObject: T;
  readonly error?: any;

  private constructor(
    success: boolean,
    message: string | string[],
    responseObject: T,
    error?: any
  ) {
    this.success = success;
    this.message = message;
    this.responseObject = responseObject;
    this.error = error;
  }

  static success<T>(message: string, responseObject: T) {
    return new ServiceResponse(true, message, responseObject);
  }

  static failure<T>(
    message: string | string[],
    responseObject: T,
    error?: any
  ) {
    return new ServiceResponse(false, message, responseObject, error);
  }
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    responseObject: dataSchema.optional(),
  });
