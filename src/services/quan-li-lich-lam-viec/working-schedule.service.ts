/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import { UserResponseGetItem } from "@/dtos/auth/auth.response.dto";
import { CreateWorkingSchedule } from "@/dtos/quan-li-lich-lam-viec/working-schedule/workingSchedule.dto";
import { PaginatedSelectOptionsResponse } from "@/dtos/select/select.response.dto";
import { StaffSearchParams } from "@/types/staff";

class WorkingScheduleServicesBase extends AxiosService {
  protected readonly basePath = "/v1/business";

  async getWorkingSchedule(
    searchFilter: FilterQueryStringTypeItem[] = [],
    params?: any
  ): Promise<UserResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}/lich-lam`,
      searchFilter,
      params
    );
  }

  async getSelectStaff(
    searchFilter: FilterQueryStringTypeItem[] = [],
    params?: StaffSearchParams
  ): Promise<PaginatedSelectOptionsResponse> {
    return this.getWithFilter(
      `${this.basePath}/user-by-management`,
      searchFilter,
      params as Record<string, string>
    );
  }

  async createWorkingSchedule(data: CreateWorkingSchedule): Promise<any> {
    return this.post(`${this.basePath}/tao-lich-lam`, data);
  }

  async deleteWorkingSchedule(scheduleId: string): Promise<any> {
    return this.delete(`/v1/working-schedule/${scheduleId}`);
  }

  async updateWorkingSchedule(
    id: string,
    data: {
      shiftCode?: any;
      status: any;
      branchCode?: any;
    }
  ): Promise<any> {
    return this.put(`/v1/working-schedule/${id}`, data);
  }
}

const WorkingScheduleServices = new WorkingScheduleServicesBase();
export default WorkingScheduleServices;
