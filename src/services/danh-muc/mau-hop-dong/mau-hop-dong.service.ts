/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  CreateMauHopDongeRequest,
  UpdateMauHopDongeRequest,
} from "@/dtos/danhMuc/mau-hop-dong/mau-hop-dong.request.dto";
import { MauHopDongResponseGetItem } from "@/dtos/danhMuc/mau-hop-dong/mau-hop-dong.response.dto";

class MauHopDongServicesBase extends AxiosService {
  protected readonly basePath = "/v1/contract/mau-hop-dong";

  async getMauHopDong(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<MauHopDongResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  createMauHopDong = async (data: CreateMauHopDongeRequest): Promise<any> => {
    return this.post(`${this.basePath}`, data);
  };

  updateMauHopDong = async (
    id: string,
    data: UpdateMauHopDongeRequest
  ): Promise<any> => {
    return this.put(`${this.basePath}/${id}`, data);
  };

  deleteMauHopDong = async (id: string): Promise<any> => {
    return this.delete(`${this.basePath}/${id}`);
  };
}

const MauHopDongServices = new MauHopDongServicesBase();
export default MauHopDongServices;
