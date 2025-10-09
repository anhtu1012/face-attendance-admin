/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  CreateAppointmentRequest as CreateInterviewRequest,
  UpdateAppointmentRequest as UpdateInterviewRequest,
} from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/interview.dto";

class InterviewServicesBase extends AxiosService {
  protected readonly basePath = "/v1/interview";

  async getInterviews(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<any> {
    return this.getWithFilter(
      `${this.basePath}`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  async getInterviewById(id: string): Promise<any> {
    return this.get(`${this.basePath}/${id}`);
  }

  async createInterview(data: CreateInterviewRequest): Promise<any> {
    const payload = {
      payload: data,
    };
    return this.post(`${this.basePath}`, payload);
  }

  async updateInterview(payload: UpdateInterviewRequest): Promise<any> {
    return this.put(`${this.basePath}/${payload.id}`, payload);
  }

  async deleteInterview(id: string): Promise<any> {
    return this.delete(`${this.basePath}/${id}`);
  }

  async updateInterviewStatus(
    id: string,
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED"
  ): Promise<any> {
    return this.put(`${this.basePath}/${id}/status`, { status });
  }
}

const InterviewServices = new InterviewServicesBase();
export default InterviewServices;
