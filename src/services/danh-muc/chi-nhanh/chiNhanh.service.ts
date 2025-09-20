/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  CreateBranchRequest,
  UpdateBranchRequest,
} from "@/dtos/danhMuc/chi-nhanh/chinhanh.request.dto";
import { DanhMucBranchResponseGetItem } from "@/dtos/danhMuc/chi-nhanh/chinhanh.response.dto";

class DanhMucChiNhanhServicesBase extends AxiosService {
  protected readonly basePath = "/v1/category/branch";

  async getDanhMucChiNhanh(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<DanhMucBranchResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  createDanhMucChiNhanh = async (data: CreateBranchRequest[]): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.post(`${this.basePath}`, payload);
  };

  updateDanhMucChiNhanh = async (data: UpdateBranchRequest[]): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.put(`${this.basePath}`, payload);
  };

  deleteDanhMucChiNhanh = async (id: string): Promise<any> => {
    return this.delete(`${this.basePath}/${id}`);
  };
}

const DanhMucChiNhanhServices = new DanhMucChiNhanhServicesBase();
export default DanhMucChiNhanhServices;
