/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  CreateSystemSettingRequest,
  UpdateSystemSettingRequest,
} from "@/dtos/danhMuc/system-setting/system-setting.request.dto";
import { SystemSettingResponseGetItem } from "@/dtos/danhMuc/system-setting/system-setting.response.dto";

class DanhMucSystemSettingServicesBase extends AxiosService {
  protected readonly basePath = "/v1/system/system-setting";

  async getDanhMucSystemSetting(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<SystemSettingResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  createDanhMucSystemSetting = async (
    data: CreateSystemSettingRequest[]
  ): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.post(`${this.basePath}`, payload);
  };

  updateDanhMucSystemSetting = async (
    data: UpdateSystemSettingRequest[]
  ): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.put(`${this.basePath}`, payload);
  };

  deleteDanhMucSystemSetting = async (id: string): Promise<any> => {
    return this.delete(`${this.basePath}/${id}`);
  };
}

const DanhMucSystemSettingServices = new DanhMucSystemSettingServicesBase();
export default DanhMucSystemSettingServices;
