/* eslint-disable @typescript-eslint/no-explicit-any */
import { NEXT_PUBLIC_SITE_URL } from "@/constants/api-constants";
// Đã loại bỏ import AuthServices để tránh vòng lặp import
import { isValidToken } from "@/utils/client/api";
import { filterQueryString } from "@/utils/client/filterQueryString ";
import { getCookie } from "@/utils/client/getCookie";
import axios, { AxiosInstance, AxiosRequestHeaders } from "axios";
import { Authorization } from "./authorization";
import { FilterQueryStringType, RepositoryPort } from "./ddd/repository.port";

export class AxiosService extends Authorization implements RepositoryPort {
  private static instance: AxiosService;
  protected baseUrl: string;
  constructor(baseUrl?: string) {
    super();
    this.baseUrl =
      baseUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? NEXT_PUBLIC_SITE_URL;
  }

  static getInstance(baseUrl?: string): AxiosService {
    this.instance = this.instance ?? new AxiosService(baseUrl);
    return this.instance;
  }

  async get<T>(url: string): Promise<T> {
    const http = await this._http();
    const response = await http.get<T>(url);
    return response.data;
  }

  async getWithParams<T>(url: string, params: URLSearchParams): Promise<T> {
    const http = await this._http();
    const response = await http.get<T>(url, { params });
    return response.data;
  }

  async getWithFilter<T>(
    url: string,
    filterParams?: FilterQueryStringType,
    extraQueryString?: string,
    regularParams?: Record<string | number | symbol, string | number | boolean>
  ): Promise<T> {
    const http = await this._http();
    const filterStr = filterQueryString(filterParams ?? []);

    let finalUrl = `${url}${filterStr}`;

    if (regularParams && Object.keys(regularParams).length > 0) {
      const separator = filterStr ? "&" : "?";
      const stringifiedParams: Record<string, string> = Object.fromEntries(
        Object.entries(regularParams).map(([key, value]) => [
          String(key),
          String(value),
        ])
      );
      const regularQueryString = new URLSearchParams(
        stringifiedParams
      ).toString();
      finalUrl += `${separator}${regularQueryString}`;
    }

    if (extraQueryString) {
      // Nếu đã có dấu ? thì nối bằng &, ngược lại nối bằng ?
      const hasQuery = finalUrl.includes("?");
      finalUrl += hasQuery ? `&${extraQueryString}` : `?${extraQueryString}`;
    }

    const response = await http.get<T>(finalUrl);
    return response.data;
  }

  async post<T, FromData>(
    url: string,
    data: FromData,
    config?: { headers?: AxiosRequestHeaders } | any
  ): Promise<T> {
    const http = await this._http();
    const response = await http.post<T>(url, data, config);
    return response.data;
  }

  async put<T, FromData>(url: string, data: FromData): Promise<T> {
    const http = await this._http();
    const response = await http.put<T>(url, data);
    return response.data;
  }

  async delete<T, FromData = any>(url: string, data?: FromData): Promise<T> {
    const http = await this._http();
    const response = await http.delete<T>(url, { data });
    return response.data;
  }

  protected async _http(): Promise<AxiosInstance> {
    const http = axios.create({
      baseURL: this.baseUrl,
      withCredentials: true,
    });

    http.interceptors.request.use(async (config) => {
      const token = getCookie("token");
      const refreshTokenn = getCookie("refreshToken");

      const header = {
        Accept: "application/json",
      } as AxiosRequestHeaders;

      // Check if we have a token first
      if (token) {
        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const payload = JSON.parse(window.atob(base64));
          const currentDate = Math.floor(Date.now() / 1000);
          const expDate = payload.exp;
          const timeLeft = expDate - currentDate;
          const timeLeftInMinutes = Math.floor(timeLeft / 60);

          if (timeLeftInMinutes > 0 && timeLeftInMinutes < 8) {
            const res = await axios.post(
              `${process.env.NEXT_PUBLIC_SITE_URL}/v1/auth/refresh-token`,
              { refreshToken: refreshTokenn }
            );
            // console.log("Token refreshed successfully:", res.data);
            document.cookie = "token=; Max-Age=0; path=/;";
            document.cookie = "refreshToken=; Max-Age=0; path=/;";
            // Set cookies with proper configuration
            this.setCookieSecurely("token", res.data.accessToken);
            this.setCookieSecurely("refreshToken", res.data.refreshToken);
            // Update the token we'll use for this request
            header.Authorization = `Bearer ${res.data.accessToken}`;
          } else {
            // Use existing valid token
            header.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.log("Error processing token:", error);
          // Still try to use the token we have
          header.Authorization = `Bearer ${token}`;
        }
      } else if (isValidToken(this.token)) {
        // Fallback to the token in the Authorization class if no cookie
        header.Authorization = `Bearer ${this.token}`;
      }

      config.headers = header;
      return config;
    });

    // Add response type handling for blob downloads and login redirect
    http.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return http;
  }
  // Helper method to set cookies consistently
  private setCookieSecurely(name: string, value: string): void {
    document.cookie = `${name}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; secure; SameSite=Strict`;
    // Also update the token in the instance if it's the access token
    if (name === "token") {
      this.token = value;
    }
  }
}
