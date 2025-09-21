/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  CreatePositionRequest,
  UpdatePositionRequest,
} from "@/dtos/danhMuc/chuc-vu/chucVu.request.dto";
import { DanhMucChucVuResponseGetItem } from "@/dtos/danhMuc/chuc-vu/chucVu.response.dto";

class DanhMucChucVuServicesBase extends AxiosService {
  protected readonly basePath = "/v1/category/position";

  async getDanhMucChucVu(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<DanhMucChucVuResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  createDanhMucChucVu = async (data: CreatePositionRequest[]): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.post(`${this.basePath}`, payload);
  };

  updateDanhMucChucVu = async (data: UpdatePositionRequest[]): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.put(`${this.basePath}`, payload);
  };

  deleteDanhMucChucVu = async (id: string): Promise<any> => {
    return this.delete(`${this.basePath}/${id}`);
  };
}

const DanhMucChucVuServices = new DanhMucChucVuServicesBase();
export default DanhMucChucVuServices;
