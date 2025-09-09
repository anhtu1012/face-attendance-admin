/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterOperationType } from "@chax-at/prisma-filter-common";

export interface AuthorizationPort {
  getToken(): string;
  setToken(token: string, expires?: string): void;
  removeToken(): void;
}

export interface RepositoryPort {
  get<T>(url: string): Promise<T>;
  getWithParams<T>(url: string, params?: URLSearchParams): Promise<T>;
  getWithFilter<T>(
    url: string,
    filterParams: FilterQueryStringType
  ): Promise<T>;
  post<T, FromData>(url: string, data: FromData): Promise<T>;
  put<T, FromData>(url: string, data: FromData): Promise<T>;
  delete<T>(url: string): Promise<T>;
}

// Adding the type definition imported from filterQueryString
export interface FilterQueryStringTypeItem {
  key: string;
  type: FilterOperationType;
  value: any;
  dir?: "asc" | "desc";
}

export type FilterQueryStringType = FilterQueryStringTypeItem[];
