/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import { PhanQuyenResponseGetItem } from "@/dtos/quan-tri-he-thong/phan-quyen/phan-quyen.response.dto";

class PhanQuyenServicesBase extends AxiosService {
  protected readonly basePath = "/v1/sa/permission";

  async getPhanQuyen(
    searchFilter: FilterQueryStringTypeItem[] = [],
    params?: any
  ): Promise<PhanQuyenResponseGetItem> {
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

  async createPhanQuyen(formData: {
    resourceCode: string;
    resourceName: string;
    parentName: string;
    scopes: string[];
    sort?: string;
  }): Promise<any> {
    return this.post(`${this.basePath}`, formData);
  }

  async updatePhanQuyen(
    id: string | undefined,
    formData: {
      resourceCode: string;
      resourceName: string;
      parentName: string;
      scopes: string[];
      sort?: string;
    }
  ): Promise<any> {
    return this.put(`${this.basePath}/${id}`, formData);
  }

  async deletePhanQuyen(id: string, status: { status: string }): Promise<any> {
    return this.delete(`${this.basePath}/${id}`, status);
  }
}

const PhanQuyenServices = new PhanQuyenServicesBase();
export default PhanQuyenServices;
