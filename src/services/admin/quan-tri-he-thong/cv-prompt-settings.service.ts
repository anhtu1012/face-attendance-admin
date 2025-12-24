/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import type {
  CvPromptSettings,
  CreateCvPromptSettingsRequest,
  UpdateCvPromptSettingsRequest,
} from "@/types/CvPromptSettings";

class CvPromptSettingsServiceBase extends AxiosService {
  protected readonly basePath = "/v1/ai-cv";

  /**
   * Get all CV prompt settings
   */
  async getAll(): Promise<any> {
    return this.getWithFilter(`${this.basePath}/get-all-ai-cv-information`);
  }

  /**
   * Get default CV prompt settings from the list
   * Returns the item where isDefault = true
   */
  async getDefaultFromList(): Promise<CvPromptSettings | null> {
    const response = await this.getAll();
    // Handle different response formats
    const items: CvPromptSettings[] = Array.isArray(response)
      ? response
      : response?.data || [];

    // Find item with isDefault = true
    return (
      items.find((item: CvPromptSettings) => item.isDefault === true) || null
    );
  }

  /**
   * Get default CV prompt settings
   */
  async getDefault(): Promise<{ data: CvPromptSettings; cached: boolean }> {
    const params = new URLSearchParams();
    params.append("default", "true");
    return this.getWithParams(`${this.basePath}`, params);
  }

  /**
   * Create new CV prompt settings
   */
  async create(payload: CreateCvPromptSettingsRequest): Promise<{
    success: boolean;
    data: CvPromptSettings;
    message: string;
  }> {
    return this.post<
      {
        success: boolean;
        data: CvPromptSettings;
        message: string;
      },
      CreateCvPromptSettingsRequest
    >(this.basePath, payload);
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
    return this.post<
      {
        success: boolean;
        data: CvPromptSettings;
        message: string;
      },
      UpdateCvPromptSettingsRequest
    >(`/v1/ai-cv/update-ai-cv/${id}`, { id, ...payload });
  }

  /**
   * Delete CV prompt settings
   */
  async deleteById(id: string): Promise<{ success: boolean; message: string }> {
    return this.delete<{ success: boolean; message: string }>(
      `${this.basePath}?id=${id}`
    );
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
