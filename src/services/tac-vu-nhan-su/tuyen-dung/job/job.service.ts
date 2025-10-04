/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  CreateJobRequest,
  UpdateJobRequest,
} from "@/dtos/tac-vu-nhan-su/tuyen-dung/job/job.request.dto";
import { JobResponseGetItem } from "@/dtos/tac-vu-nhan-su/tuyen-dung/job/job.response.dto";

class JobServicesBase extends AxiosService {
  protected readonly basePath = "/v1/sa/user";
  protected readonly additionalPath = "/v1/sa/user/array";

  async getJob(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<JobResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  createJob = async (data: CreateJobRequest): Promise<any> => {
    return this.post(`${this.additionalPath}`, data);
  };

  async updateJob(payload: UpdateJobRequest): Promise<any> {
    return this.put(`${this.additionalPath}`, payload);
  }

  async deleteJob(id: string): Promise<any> {
    return this.delete(`${this.basePath}/${id}`);
  }
}

const JobServices = new JobServicesBase();
export default JobServices;
