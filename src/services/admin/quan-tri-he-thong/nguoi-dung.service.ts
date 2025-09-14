/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import { NguoiDungResponseGetItem } from "@/dtos/quan-tri-he-thong/nguoi-dung/nguoi-dung.response.dto";

class NguoiDungServicesBase extends AxiosService {
  protected readonly basePath = "/v1/sa/user";

  async getNguoiDung(
    searchFilter: FilterQueryStringTypeItem[] = [],
    params?: any
  ): Promise<NguoiDungResponseGetItem> {
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

  async createNguoiDung(formData: {
    userName: string;
    password: string;
    roleCode: string;
    firstName: string;
    lastName: string;
    email: string;
    faceImg?: string | null;
    birthDay: Date;
    gender: "M" | "F";
    phone: string;
    address?: string | null;
    isActive?: boolean;
  }): Promise<any> {
    return this.post(`${this.basePath}`, formData);
  }

  async updateNguoiDung(
    id: string | undefined,
    formData: {
      userName: string;
      password: string;
      roleCode: string;
      firstName: string;
      lastName: string;
      email: string;
      faceImg: string;
      birthDay: Date;
      gender: "M" | "F";
      phone: string;
      address: string;
      isActive: boolean;
    }
  ): Promise<any> {
    return this.put(`${this.basePath}/${id}`, formData);
  }

  async deleteNguoiDung(id: string, status: { status: string }): Promise<any> {
    return this.delete(`${this.basePath}/${id}`, status);
  }
}

const NguoiDungServices = new NguoiDungServicesBase();
export default NguoiDungServices;
