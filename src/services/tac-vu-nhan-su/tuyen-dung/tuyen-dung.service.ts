/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  CreateTuyenDungRequest,
  UpdateTuyenDungRequest,
} from "@/dtos/tac-vu-nhan-su/tuyen-dung/tuyen-dung.request.dto";
import { TuyenDungResponseGetItem } from "@/dtos/tac-vu-nhan-su/tuyen-dung/tuyen-dung.response.dto";

class TuyenDungServicesBase extends AxiosService {
  protected readonly basePath = "/v1/recruitment";

  async getTuyenDung(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<TuyenDungResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}/tuyen-dung`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  createTuyenDung = async (data: CreateTuyenDungRequest): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.post(`${this.basePath}`, payload);
  };

  async updateTuyenDung(payload: UpdateTuyenDungRequest): Promise<any> {
    return this.put(`${this.basePath}`, payload);
  }

  async deleteTuyenDung(id: string): Promise<any> {
    return this.delete(`${this.basePath}/${id}`);
  }
}

const TuyenDungServices = new TuyenDungServicesBase();
export default TuyenDungServices;
