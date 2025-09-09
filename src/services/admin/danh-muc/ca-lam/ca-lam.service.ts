/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import { CaLamResponseGetItem } from "@/dtos/danhMuc/ca-lam/ca-lam.response.dto";

class DanhMucCaLamServicesBase extends AxiosService {
  protected readonly basePath = "/v1/shift";

  async getDanhMucCaLam(
    searchFilter: FilterQueryStringTypeItem[] = [],
    params?: any
  ): Promise<CaLamResponseGetItem> {
    if (params && Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      return this.getWithParams(`${this.basePath}`, queryParams);
    }
    return this.getWithFilter(`${this.basePath}`, searchFilter);
  }

  async createDanhMucCaLam(formData: { name: string; startTime: string; endTime: string }): Promise<any> {
    return this.post(`${this.basePath}`, formData);
  }

  async updateDanhMucCaLam(
    id: string | undefined,
    formData: { name: string; startTime: string; endTime: string }
  ): Promise<any> {
    return this.put(`${this.basePath}/${id}`, formData);
  }

  async deleteDanhMucCaLam(id: string, status: { status: string }): Promise<any> {
    return this.delete(`${this.basePath}/${id}`, status);
  }
}

const DanhMucCaLamServices = new DanhMucCaLamServicesBase();
export default DanhMucCaLamServices;
