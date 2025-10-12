/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  CreateBoPhanRequest,
  UpdateBoPhanRequest,
} from "@/dtos/danhMuc/bo-phan/bophan.request.dto";
import { DanhMucBoPhanResponseGetItem } from "@/dtos/danhMuc/bo-phan/bophan.response.dto";

class DanhMucBoPhanServicesBase extends AxiosService {
  protected readonly basePath = "/v1/category/department";

  async getDanhMucBoPhan(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<DanhMucBoPhanResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  createDanhMucBoPhan = async (data: CreateBoPhanRequest[]): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.post(`${this.basePath}`, payload);
  };

  updateDanhMucBoPhan = async (data: UpdateBoPhanRequest[]): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.put(`${this.basePath}`, payload);
  };

  deleteDanhMucBoPhan = async (id: string): Promise<any> => {
    return this.delete(`${this.basePath}/${id}`);
  };
}

const DanhMucBoPhanServices = new DanhMucBoPhanServicesBase();
export default DanhMucBoPhanServices;
