/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidateBaseClass } from "@/apis/ddd/validate.class.base";

import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  CreatePositionRequest,
  CreatePositionSchema,
  UpdatePositionRequest,
  UpdatePositionSchema,
} from "@/dtos/danhMuc/chucVu/chucVu.request.dto";
import { DanhMucChucVuResponseGetItem } from "@/dtos/danhMuc/chucVu/chucVu.response.dto";

class DanhMucChucVuServicesBase extends AxiosService {
  protected readonly basePath = "/v1/position";

  async getDanhMucChucVu(
    searchFilter: FilterQueryStringTypeItem[] = [],
    params?: any
  ): Promise<DanhMucChucVuResponseGetItem> {
    return this.getWithFilter(`${this.basePath}`, searchFilter, params);
  }
  async createDanhMucChucVu(formData: CreatePositionRequest): Promise<any> {
    await ValidateBaseClass.validate(formData, CreatePositionSchema);
    return this.post(`${this.basePath}`, formData);
  }
  async updateDanhMucChucVu(
    id: string | undefined,
    formData: UpdatePositionRequest
  ): Promise<any> {
    await ValidateBaseClass.validate(formData, UpdatePositionSchema);
    return this.put(`${this.basePath}/${id}`, formData);
  }
  
  async deleteDanhMucChucVu(id: string): Promise<any> {
    return this.delete(`${this.basePath}/${id}`);
  }
}

const DanhMucChucVuServices = new DanhMucChucVuServicesBase();
export default DanhMucChucVuServices;
