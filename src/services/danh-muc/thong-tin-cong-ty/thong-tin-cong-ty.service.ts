/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  CreateCompanyInfoRequest,
  UpdateCompanyInfoRequest,
} from "@/dtos/danhMuc/thong-tin-cong-ty/thongTinCongTy.request.dto";
import { CompanyInfoResponseGetItem } from "@/dtos/danhMuc/thong-tin-cong-ty/thongTinCongTy.response.dto";

class DanhMucCompanyInfoServicesBase extends AxiosService {
  protected readonly basePath = "/v1/company/thong-tin-cong-ty";
  protected readonly baseCustom = "/v1/company";

  async getOffDayList(): Promise<string[]> {
    return this.get<string[]>(`${this.baseCustom}/offdays-upcoming`);
  }

  async deleteOffDayList(): Promise<string[]> {
    return this.delete<string[]>(`${this.baseCustom}/offdays-upcoming`);
  }

  async getDanhMucCompanyInfo(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<CompanyInfoResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}`,
      searchFilter,
      quickSearchText,
      params
    );
  }
  async getRepresentCompanyInfo(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<any> {
    return this.getWithFilter(
      `${this.baseCustom}/thong-tin-nguoi-dai-dien`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  createDanhMucCompanyInfo = async (
    data: CreateCompanyInfoRequest[]
  ): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.post(`${this.basePath}`, payload);
  };

  // Multipart create: accept FormData with keys: 'payload' (json) and optional 'logo' (file)
  createDanhMucCompanyInfoMultipart = async (
    formData: FormData
  ): Promise<any> => {
    return this.post(`${this.basePath}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  updateDanhMucCompanyInfo = async (
    data: UpdateCompanyInfoRequest[]
  ): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.put(`${this.basePath}`, payload);
  };

  deleteDanhMucCompanyInfo = async (id: string): Promise<any> => {
    return this.delete(`${this.basePath}/${id}`);
  };
}

const DanhMucCompanyInfoServices = new DanhMucCompanyInfoServicesBase();
export default DanhMucCompanyInfoServices;
