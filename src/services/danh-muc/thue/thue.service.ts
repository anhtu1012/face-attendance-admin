/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  CreateThueRequest,
  UpdateThueRequest,
} from "@/dtos/danhMuc/thue/thue.request.dto";
import { ThueResponseGetItem } from "@/dtos/danhMuc/thue/thue.response.dto";

class DanhMucThueServicesBase extends AxiosService {
  protected readonly basePath = "/v1/category/tax";

  async getDanhMucThue(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<ThueResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  async createDanhMucThue(payload: CreateThueRequest): Promise<any> {
    return this.post(`${this.basePath}`, payload);
  }

  async updateDanhMucThue(payload: UpdateThueRequest): Promise<any> {
    return this.put(`${this.basePath}`, payload);
  }

  async deleteDanhMucThue(id: string): Promise<any> {
    return this.delete(`${this.basePath}/${id}`);
  }
}

const DanhMucThueServices = new DanhMucThueServicesBase();
export default DanhMucThueServices;
