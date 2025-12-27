/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import { UpdateCaLamRequest } from "@/dtos/danhMuc/ca-lam/ca-lam.request.dto";
import { AppendixWithUser } from "@/dtos/tac-vu-nhan-su/quan-ly-hop-dong/appendix/appendix.dto";
import { QuanlyPhuLucResponseGetItem } from "@/dtos/tac-vu-nhan-su/quan-ly-hop-dong/appendix/appendix.response.dto";
import { ContractWithUser } from "@/dtos/tac-vu-nhan-su/quan-ly-hop-dong/contracts/contract.dto";
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

  async getChiTietHopDong(id: string): Promise<ContractWithUser> {
    return this.getWithFilter(`${this.basePath}/chi-tiet-hop-dong/${id}`);
  }

  createQuanLyHopDong = async (data: CreateContractRequest): Promise<any> => {
    return this.post(`${this.basePath}/tao-hop-dong`, data);
  };
  dungHopDong = async (data: {
    userContractId: string;
  }): Promise<any> => {
    return this.put(`${this.basePath}/dung-hop-dong`, data);
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

  uploadContractMultipart = async (formData: FormData): Promise<any> => {
    return this.post(`${this.basePath}/upload-hop-dong`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };
  uploadAppendixMultipart = async (formData: FormData): Promise<any> => {
    return this.post(`${this.basePath}/upload-phu-luc-hop-dong`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: 120000,
    });
  };

  getOpt = async (data: {
    userContractId?: string;
    userContractExtendedId?: string;
    gmail?: string;
  }): Promise<any> => {
    return this.post(`${this.basePath}/gui-otp`, data);
  };

  saveContractSignatures = async (formData: FormData): Promise<any> => {
    return this.post(`${this.basePath}/xac-nhan-otp`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  //Phục Lục
  async getPhuLucHopDong(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<QuanlyPhuLucResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}/phu-luc-hop-dong`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  async getChiTietPhuLuc(id: string): Promise<AppendixWithUser> {
    return this.getWithFilter(`${this.basePath}/chi-tiet-phu-luc/${id}`);
  }

  createPhucLucHopDong = async (data: CreateContractRequest): Promise<any> => {
    return this.post(`${this.basePath}/tao-phu-luc-hop-dong`, data);
  };
}

const QuanLyHopDongServices = new QuanLyHopDongServicesBase();
export default QuanLyHopDongServices;
