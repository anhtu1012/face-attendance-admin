/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import { CreateNhomNguoiDungRequest } from "@/dtos/quan-tri-he-thong/nhom-nguoi-dung/nhom-nguoi-dung.request.dto";
import { NhomNguoiDungResponseGetItem } from "@/dtos/quan-tri-he-thong/nhom-nguoi-dung/nhom-nguoi-dung.response.dto";

class NhomNguoiDungServicesBase extends AxiosService {
  protected readonly basePath = "/v1/sa/role";
  protected readonly additionalPath = "/v1/sa/role/array";

  async getNhomNguoiDung(
    searchFilter: FilterQueryStringTypeItem[] = [],
    params?: any
  ): Promise<NhomNguoiDungResponseGetItem> {
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

  async createNhomNguoiDung(payload: CreateNhomNguoiDungRequest): Promise<any> {
    return this.post(`${this.additionalPath}`, payload);
  }

  async updateNhomNguoiDung(payload: CreateNhomNguoiDungRequest): Promise<any> {
    return this.put(`${this.additionalPath}`, payload);
  }

  async deleteNhomNguoiDung(id: string): Promise<any> {
    return this.delete(`${this.basePath}/${id}`, status);
  }
}

const NhomNguoiDungServices = new NhomNguoiDungServicesBase();
export default NhomNguoiDungServices;
