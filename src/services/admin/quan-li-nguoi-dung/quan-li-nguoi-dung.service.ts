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
    return this.getWithFilter(
      `/v1/business/get-user-by-management`,
      searchFilter,
      params
    );
  }

  async getUserByCode(userCode: string): Promise<any> {
    return this.get(`/v1/business/get-user-by-management?userCode=${userCode}`);
  }

  async createUser(formData: any): Promise<any> {
    return this.post(`${this.basePath}`, formData);
  }

  async updateUserManager(data: {
    userId: string;
    managedByUserId: string;
  }): Promise<any> {
    return this.post(`/v1/sa/user/update-user-manager`, data);
  }

  async updateUser(
    id: string | undefined,
    formData: UserRequestUpdateUsser
  ): Promise<any> {
    await ValidateBaseClass.validate(formData, UserRequestChangePasswordSchema);
    return this.put(`/v1/sa/user/${id}`, formData);
  }

  async deleteUser(id: string): Promise<any> {
    return this.delete(`${this.basePath}/${id}`);
  }
  async getUserByManagement(
    searchFilter: FilterQueryStringTypeItem[] = [],
    params?: any
  ): Promise<any> {
    return this.getWithFilter(
      `/v1/business/user-by-management`,
      searchFilter,
      params
    );
  }

  async createSchedule(data: {
    departmentId: string;
    listUserIds: string[];
    listDates: string[];
  }): Promise<any> {
    return this.post(`/v1/sa/user/create-schedule-sep`, data);
  }
}

const QlNguoiDungServices = new QlNguoiDungServicesBase();
export default QlNguoiDungServices;
