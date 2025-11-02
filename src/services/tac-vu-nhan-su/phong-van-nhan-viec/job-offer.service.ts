/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import { CreateJobOfferRequest } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/job-offer.dto";

class JobOfferServicesBase extends AxiosService {
  protected readonly basePath = "/v1/job-offer";

  async getJobOffers(
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

  async getJobOfferById(id: string): Promise<any> {
    return this.get(`${this.basePath}/${id}`);
  }

  async createJobOffer(data: CreateJobOfferRequest): Promise<any> {
    const payload = {
      payload: data,
    };
    return this.post(`${this.basePath}`, payload);
  }

  // async updateJobOffer(payload: UpdateJobOfferRequest): Promise<any> {
  //   return this.put(`${this.basePath}/${payload.id}`, payload);
  // }

  async deleteJobOffer(id: string): Promise<any> {
    return this.delete(`${this.basePath}/${id}`);
  }

  async updateJobOfferStatus(
    id: string,
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED"
  ): Promise<any> {
    return this.put(`${this.basePath}/${id}/status`, { status });
  }
}

const JobOfferServices = new JobOfferServicesBase();
export default JobOfferServices;
