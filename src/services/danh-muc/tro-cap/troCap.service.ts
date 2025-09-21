/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  CreateTroCapRequest,
  UpdateTroCapRequest,
} from "@/dtos/danhMuc/tro-cap/troCap.request.dto";
import { TroCapResponseGetItem } from "@/dtos/danhMuc/tro-cap/troCap.response.dto";

class DanhMucTroCapServicesBase extends AxiosService {
  protected readonly basePath = "/v1/category/allowance";

  async getDanhMucTroCap(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<TroCapResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  createDanhMucTroCap = async (data: CreateTroCapRequest[]): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.post(`${this.basePath}`, payload);
  };

  updateDanhMucTroCap = async (data: UpdateTroCapRequest[]): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.put(`${this.basePath}`, payload);
  };

  deleteDanhMucTroCap = async (id: string): Promise<any> => {
    return this.delete(`${this.basePath}/${id}`);
  };
}

const DanhMucTroCapServices = new DanhMucTroCapServicesBase();
export default DanhMucTroCapServices;
