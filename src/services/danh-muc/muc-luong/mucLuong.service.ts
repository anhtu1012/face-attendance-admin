/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  CreateMucLuongRequest,
  UpdateMucLuongRequest,
} from "@/dtos/danhMuc/muc-luong/mucLuong.request.dto";
import { DanhMucMucLuongResponseGetItem } from "@/dtos/danhMuc/muc-luong/mucLuong.response.dto";

class DanhMucMucLuongServicesBase extends AxiosService {
  protected readonly basePath = "/v1/category/level-salary";

  async getDanhMucMucLuong(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<DanhMucMucLuongResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  createDanhMucMucLuong = async (
    data: CreateMucLuongRequest[]
  ): Promise<any> => {
    // chuyển startSalary, endSalary về dạng string
    const payloadData = data.map((item: any) => ({
      ...item,
      startSalary:
        item.startSalary !== undefined && item.startSalary !== null
          ? String(item.startSalary)
          : item.startSalary,
      endSalary:
        item.endSalary !== undefined && item.endSalary !== null
          ? String(item.endSalary)
          : item.endSalary,
    }));

    const payload = {
      payload: payloadData,
    };
    return this.post(`${this.basePath}`, payload);
  };

  updateDanhMucMucLuong = async (
    data: UpdateMucLuongRequest[]
  ): Promise<any> => {
    const payloadData = data.map((item: any) => ({
      ...item,
      startSalary:
        item.startSalary !== undefined && item.startSalary !== null
          ? String(item.startSalary)
          : item.startSalary,
      endSalary:
        item.endSalary !== undefined && item.endSalary !== null
          ? String(item.endSalary)
          : item.endSalary,
    }));

    const payload = {
      payload: payloadData,
    };
    return this.put(`${this.basePath}`, payload);
  };

  deleteDanhMucMucLuong = async (id: string): Promise<any> => {
    return this.delete(`${this.basePath}/${id}`);
  };
}

const DanhMucMucLuongServices = new DanhMucMucLuongServicesBase();
export default DanhMucMucLuongServices;
