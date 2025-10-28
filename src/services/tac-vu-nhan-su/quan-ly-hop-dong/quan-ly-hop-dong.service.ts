/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import { UpdateCaLamRequest } from "@/dtos/danhMuc/ca-lam/ca-lam.request.dto";
import { CreateContractRequest } from "@/dtos/tac-vu-nhan-su/quan-ly-hop-dong/contracts/contract.request.dto";
import { QuanlyHopDongResponseGetItem } from "@/dtos/tac-vu-nhan-su/quan-ly-hop-dong/contracts/contract.response.dto";
import { UserCreateContractResponseGetItem } from "@/dtos/tac-vu-nhan-su/quan-ly-hop-dong/user-create-contract/user-create-contract.response.dto";

class QuanLyHopDongServicesBase extends AxiosService {
  protected readonly basePath = "/v1/contract";

  async getQuanLyHopDong(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<QuanlyHopDongResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}/danh-sach-hop-dong`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  async getListUserCreateContract(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<UserCreateContractResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}/danh-sach-nhan-su`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  createQuanLyHopDong = async (data: CreateContractRequest): Promise<any> => {
    return this.post(`${this.basePath}/tao-hop-dong`, data);
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
