/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidateBaseClass } from "@/apis/ddd/validate.class.base";

import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import { UserResponseGetItem } from "@/dtos/auth/auth.response.dto";
import {
  UserRequestChangePasswordSchema,
  UserRequestUpdateUsser,
} from "@/dtos/auth/auth.request.dto";
class QlNguoiDungServicesBase extends AxiosService {
  protected readonly basePath = "/v1/user";

  async getUser(
    searchFilter: FilterQueryStringTypeItem[] = [],
    params?: any
  ): Promise<UserResponseGetItem> {
    return this.getWithFilter(`/v1/business/get-user-by-management`, searchFilter, params);
  }

  async getUserByCode(userCode: string): Promise<any> {
    return this.get(`/v1/business/get-user-by-management?userCode=${userCode}`);
  }

  async updateUser(
    id: string | undefined,
    formData: UserRequestUpdateUsser
  ): Promise<any> {
    await ValidateBaseClass.validate(formData, UserRequestChangePasswordSchema);
    return this.put(`${this.basePath}/${id}`, formData);
  }
  async deleteUser(id: string): Promise<any> {
    return this.delete(`${this.basePath}/${id}`);
  }
  async getUserByManagement(
    searchFilter: FilterQueryStringTypeItem[] = [],
    params?: any
  ): Promise<any> {
    return this.getWithFilter(`/v1/business/user-by-management`, searchFilter, params)
  }
}

const QlNguoiDungServices = new QlNguoiDungServicesBase();
export default QlNguoiDungServices;
