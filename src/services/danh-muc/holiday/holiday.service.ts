// Fake API Service for Holiday Configuration
// Simulates backend database with localStorage

import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  CreateHolidayDtoType,
  HolidayDtoType,
} from "@/dtos/danhMuc/holiday-config/holiday-config.dto";
import { HolidayResponseGetItem } from "@/dtos/danhMuc/holiday-config/holiday-config.response.dto";

class HolidayService extends AxiosService {
  protected readonly basePath = "/v1/company-holiday";

  async getHolidays(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<HolidayResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  // Create holiday
  async createHolidays(
    holiday: CreateHolidayDtoType[]
  ): Promise<HolidayDtoType> {
    const payload = { payload: holiday };
    return this.post(`${this.basePath}`, payload);
  }

  // Delete holiday by IDs
  async deleteHoliday(id: string): Promise<void> {
    return this.delete(`${this.basePath}/${id}`);
  }
}

const HolidayApiService = new HolidayService();
export default HolidayApiService;
