/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  CreateNguoiDungRequest,
  UpdateNguoiDungRequest,
} from "@/dtos/quan-tri-he-thong/nguoi-dung/nguoi-dung.request.dto";
import { NguoiDungResponseGetItem } from "@/dtos/quan-tri-he-thong/nguoi-dung/nguoi-dung.response.dto";

class NguoiDungServicesBase extends AxiosService {
  protected readonly basePath = "/v1/sa/user";
  protected readonly additionalPath = "/v1/sa/user/array";

  async getNguoiDung(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<NguoiDungResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  createNguoiDung = async (data: CreateNguoiDungRequest): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.post(`${this.additionalPath}`, payload);
  };

  async updateNguoiDung(payload: UpdateNguoiDungRequest): Promise<any> {
    return this.put(`${this.additionalPath}`, payload);
  }

  async deleteNguoiDung(id: string): Promise<any> {
    return this.delete(`${this.basePath}/${id}`);
  }
}

const NguoiDungServices = new NguoiDungServicesBase();
export default NguoiDungServices;
