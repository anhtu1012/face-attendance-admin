/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  CreateCaLamRequest,
  UpdateCaLamRequest,
} from "@/dtos/danhMuc/ca-lam/ca-lam.request.dto";
import { QuanlyHopDongResponseGetItem } from "@/dtos/tac-vu-nhan-su/quan-ly-hop-dong/contracts/contract.response.dto";

class QuanLyHopDongServicesBase extends AxiosService {
  protected readonly basePath = "/v1/contract/tao-hop-dong";

  async getQuanLyHopDong(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<QuanlyHopDongResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  createQuanLyHopDong = async (data: CreateCaLamRequest[]): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.post(`${this.basePath}`, payload);
  };

  updateQuanLyHopDong = async (data: UpdateCaLamRequest[]): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.put(`${this.basePath}`, payload);
  };

  deleteQuanLyHopDong = async (id: string): Promise<any> => {
    return this.delete(`${this.basePath}/${id}`);
  };
}

const QuanLyHopDongServices = new QuanLyHopDongServicesBase();
export default QuanLyHopDongServices;
