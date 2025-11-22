/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import { JobDetail } from "@/dtos/tac-vu-nhan-su/tuyen-dung/job/job-detail.dto";
import { QuantityStatus } from "@/dtos/tac-vu-nhan-su/tuyen-dung/job/job.dto";
import {
  CreateJobRequest,
  UpdateJobRequest,
} from "@/dtos/tac-vu-nhan-su/tuyen-dung/job/job.request.dto";
import { JobResponseGetItem } from "@/dtos/tac-vu-nhan-su/tuyen-dung/job/job.response.dto";
import {
  HRUser,
  ShareJobRequest,
  ShareJobResponse,
  JobShareRequest,
  AcceptShareRequest,
  RejectShareRequest,
} from "@/dtos/tac-vu-nhan-su/tuyen-dung/job/job-share.dto";

class JobServicesBase extends AxiosService {
  protected readonly basePath = "/v1/recruitment";

  async getJob(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<JobResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}/tuyen-dung/danh-sach-cong-viec`,
      searchFilter,
      quickSearchText,
      params
    );
  }
  async getJobQuanlity(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<QuantityStatus> {
    return this.getWithFilter(
      `${this.basePath}/tuyen-dung/so-luong-ung-vien`,
      searchFilter,
      quickSearchText,
      params
    );
  }
  async getDetailJob(jobCode: string): Promise<JobDetail> {
    return this.get(
      `${this.basePath}/tuyen-dung/danh-sach-cong-viec/chi-tiet?jobCode=${jobCode}`
    );
  }

  createJob = async (data: CreateJobRequest): Promise<any> => {
    return this.post(`${this.basePath}/tao-cong-viec`, data);
  };

  async updateJob(id: string, payload: UpdateJobRequest): Promise<any> {
    return this.put(
      `${this.basePath}/tuyen-dung/cap-nhat-don-ung-tuyen/${id}`,
      payload
    );
  }

  async deleteJob(id: string): Promise<any> {
    return this.delete(`${this.basePath}/job-application-form/${id}`);
  }

  // Job Share Methods
  async getHRUsers(): Promise<HRUser[]> {
    return this.get(`${this.basePath}/hr-users`);
  }

  async shareJob(data: ShareJobRequest): Promise<ShareJobResponse> {
    return this.post(`${this.basePath}/tuyen-dung/share-job`, data);
  }

  async getShareRequests(jobCode?: string): Promise<JobShareRequest[]> {
    const query = jobCode ? `?jobCode=${jobCode}` : "";
    return this.get(`${this.basePath}/tuyen-dung/share-requests${query}`);
  }

  async cancelShareRequest(requestId: string): Promise<any> {
    return this.delete(
      `${this.basePath}/tuyen-dung/share-requests/${requestId}`
    );
  }

  async acceptShareRequest(data: AcceptShareRequest): Promise<any> {
    return this.post(`${this.basePath}/tuyen-dung/share-requests/accept`, data);
  }

  async rejectShareRequest(data: RejectShareRequest): Promise<any> {
    return this.post(`${this.basePath}/tuyen-dung/share-requests/reject`, data);
  }
}

const JobServices = new JobServicesBase();
export default JobServices;
