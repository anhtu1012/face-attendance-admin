/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import type {
  CvPromptSettings,
  CreateCvPromptSettingsRequest,
  UpdateCvPromptSettingsRequest,
} from "@/types/CvPromptSettings";

class CvPromptSettingsServiceBase extends AxiosService {
  protected readonly basePath = "/api/cv-prompt-settings";

  /**
   * Get all CV prompt settings
   */
  async getAll(params?: {
    isActive?: boolean;
  }): Promise<{ data: CvPromptSettings[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params?.isActive !== undefined) {
      queryParams.append("isActive", String(params.isActive));
    }

    const response = await fetch(`${this.basePath}?${queryParams.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch CV prompt settings");
    }

    return response.json();
  }

  /**
   * Get default CV prompt settings
   */
  async getDefault(): Promise<{ data: CvPromptSettings; cached: boolean }> {
    const response = await fetch(`${this.basePath}?default=true`);

    if (!response.ok) {
      throw new Error("Failed to fetch default CV prompt settings");
    }

    return response.json();
  }

  /**
   * Create new CV prompt settings
   */
  async create(payload: CreateCvPromptSettingsRequest): Promise<{
    success: boolean;
    data: CvPromptSettings;
    message: string;
  }> {
    const response = await fetch(this.basePath, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create CV prompt settings");
    }

    return response.json();
  }

  /**
   * Update CV prompt settings
   */
  async update(
    id: string,
    payload: UpdateCvPromptSettingsRequest
  ): Promise<{
    success: boolean;
    data: CvPromptSettings;
    message: string;
  }> {
    const response = await fetch(this.basePath, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...payload }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update CV prompt settings");
    }

    return response.json();
  }

  /**
   * Delete CV prompt settings
   */
  async deleteById(id: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.basePath}?id=${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete CV prompt settings");
    }

    return response.json();
  }

  /**
   * Set as default
   */
  async setAsDefault(id: string): Promise<{
    success: boolean;
    data: CvPromptSettings;
    message: string;
  }> {
    return this.update(id, { isDefault: true });
  }

  /**
   * Toggle active status
   */
  async toggleActive(
    id: string,
    isActive: boolean
  ): Promise<{
    success: boolean;
    data: CvPromptSettings;
    message: string;
  }> {
    return this.update(id, { isActive });
  }
}

const CvPromptSettingsService = new CvPromptSettingsServiceBase();
export default CvPromptSettingsService;
