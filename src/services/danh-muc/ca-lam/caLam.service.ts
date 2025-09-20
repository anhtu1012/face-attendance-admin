/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  CreateCaLamRequest,
  UpdateCaLamRequest,
} from "@/dtos/danhMuc/ca-lam/ca-lam.request.dto";
import { CaLamResponseGetItem } from "@/dtos/danhMuc/ca-lam/ca-lam.response.dto";

class DanhMucCaLamServicesBase extends AxiosService {
  protected readonly basePath = "/v1/category/shift";

  async getDanhMucCaLam(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<CaLamResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  createDanhMucCaLam = async (data: CreateCaLamRequest[]): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.post(`${this.basePath}`, payload);
  };

  updateDanhMucCaLam = async (data: UpdateCaLamRequest[]): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.put(`${this.basePath}`, payload);
  };

  deleteDanhMucCaLam = async (id: string): Promise<any> => {
    return this.delete(`${this.basePath}/${id}`);
  };
}

const DanhMucCaLamServices = new DanhMucCaLamServicesBase();
export default DanhMucCaLamServices;
