/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  CreateKyNangRequest,
  UpdateKyNangRequest,
} from "@/dtos/danhMuc/ki-nang/kyNang.request.dto";
import { KyNangResponseGetItem } from "@/dtos/danhMuc/ki-nang/kyNang.response.dto";

class DanhMucKyNangServicesBase extends AxiosService {
  protected readonly basePath = "/v1/category/skill";

  async getDanhMucKyNang(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<KyNangResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  createDanhMucKyNang = async (data: CreateKyNangRequest[]): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.post(`${this.basePath}`, payload);
  };

  updateDanhMucKyNang = async (data: UpdateKyNangRequest[]): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.put(`${this.basePath}`, payload);
  };

  deleteDanhMucKyNang = async (id: string): Promise<any> => {
    return this.delete(`${this.basePath}/${id}`);
  };
}

const DanhMucKyNangServices = new DanhMucKyNangServicesBase();
export default DanhMucKyNangServices;
