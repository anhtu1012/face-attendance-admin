/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  CreateFormRequest,
  UpdateFormRequest,
} from "@/dtos/danhMuc/don/don.request.dto";
import { FormResponseGetItem } from "@/dtos/danhMuc/don/don.response.dto";

class DanhMucDonServicesBase extends AxiosService {
  protected readonly basePath = "/v1/category/form-category";

  async getDanhMucDon(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<FormResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  createDanhMucDon = async (data: CreateFormRequest[]): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.post(`${this.basePath}`, payload);
  };

  updateDanhMucDon = async (data: UpdateFormRequest[]): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.put(`${this.basePath}`, payload);
  };

  deleteDanhMucDon = async (id: string): Promise<any> => {
    return this.delete(`${this.basePath}/${id}`);
  };
}

const DanhMucDonServices = new DanhMucDonServicesBase();
export default DanhMucDonServices;
