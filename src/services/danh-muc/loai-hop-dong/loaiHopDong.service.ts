/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  CreateContractTypeRequest,
  UpdateContractTypeRequest,
} from "@/dtos/danhMuc/loai-hop-dong/loaiHopDong.request.dto";
import { ContractTypeResponseGetItem } from "@/dtos/danhMuc/loai-hop-dong/loaiHopDong.response.dto";

class DanhMucLoaiHopDongServicesBase extends AxiosService {
  protected readonly basePath = "/v1/category/contract-type";

  async getDanhMucLoaiHopDong(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<ContractTypeResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  createDanhMucLoaiHopDong = async (
    data: CreateContractTypeRequest[]
  ): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.post(`${this.basePath}`, payload);
  };

  updateDanhMucLoaiHopDong = async (
    data: UpdateContractTypeRequest[]
  ): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.put(`${this.basePath}`, payload);
  };

  deleteDanhMucLoaiHopDong = async (id: string): Promise<any> => {
    return this.delete(`${this.basePath}/${id}`);
  };
}

const DanhMucLoaiHopDongServices = new DanhMucLoaiHopDongServicesBase();
export default DanhMucLoaiHopDongServices;
