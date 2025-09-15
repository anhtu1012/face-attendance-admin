/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidateBaseClass } from "@/apis/ddd/validate.class.base";

import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  CreateFormRequest,
  CreateFormSchema,
  UpdateFormRequest,
  UpdateFormSchema,
} from "@/dtos/danhMuc/don/don.request.dto";
import { FormResponseGetItem } from "@/dtos/danhMuc/don/don.response.dto";

export interface SearchParams {
  quickSearch?: string;
}

class DanhMucDonServicesBase extends AxiosService {
  protected readonly basePath = "/v1/form";

  async getDanhMucDon(
    searchFilter: FilterQueryStringTypeItem[] = [],
    params?: SearchParams
  ): Promise<FormResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}`,
      searchFilter,
      params as Record<string, string>
    );
  }

  async createDanhMucDon(formData: CreateFormRequest): Promise<any> {
    await ValidateBaseClass.validate(formData, CreateFormSchema);
    return this.post(`${this.basePath}`, formData);
  }

  async updateDanhMucDon(
    id: string | undefined,
    formData: UpdateFormRequest
  ): Promise<any> {
    await ValidateBaseClass.validate(formData, UpdateFormSchema);
    return this.put(`${this.basePath}/${id}`, formData);
  }
  async softDeleteDanhMucDon(
    id: string | undefined,
  ): Promise<any> {
    return this.put(`${this.basePath}/${id}`, {
      status: "INACTIVE"
    });
  }
  async revertDeletedDanhMucDon(
    id: string | undefined,
  ): Promise<any> {
    return this.put(`${this.basePath}/${id}`, {
      status: "ACTIVE"
    });
  }
  // async revertDeletedDanhMucDon(
  //   id: string | undefined,
  // ): Promise<any> {
  //   return this.put(`${this.basePath}/${id}`, {
  //     status: "ACTIVE"
  //   });
  // }

  async deleteDanhMucDon(id: string): Promise<any> {
    return this.delete(`${this.basePath}/${id}`);
  }
}

const DanhMucDonServices = new DanhMucDonServicesBase();
export default DanhMucDonServices;
