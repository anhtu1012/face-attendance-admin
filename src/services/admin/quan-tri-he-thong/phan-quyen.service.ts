import { savePhanQuyenRequest } from "./../../../dtos/quan-tri-he-thong/phan-quyen/phan-quyen.request.dto";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import { PhanQuyenResponseGetItem } from "@/dtos/quan-tri-he-thong/phan-quyen/phan-quyen.response.dto";
import { TaiKhoanNhomVaiTroResponseGetItem } from "@/dtos/quan-tri-he-thong/phan-quyen/tai-khoan/tai-khoan.response.dto";

class PhanQuyenServicesBase extends AxiosService {
  protected readonly basePath = "/v1/sa";
  protected readonly additionPath = "/v1/sa/user/find-accounts";

  async getPhanQuyen(
    searchFilter: FilterQueryStringTypeItem[] = [],
    params?: any
  ): Promise<PhanQuyenResponseGetItem> {
    if (params && Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      return this.getWithParams(
        `${this.basePath}/permission-by-role`,
        queryParams
      );
    }
    return this.getWithFilter(
      `${this.basePath}/permission-by-role`,
      searchFilter
    );
  }

  async savePhanQuyen(payload: savePhanQuyenRequest): Promise<any> {
    return this.post(`${this.basePath}/permission-array-by-group`, payload);
  }

  // Lấy danh sách người dùng thuộc nhóm vai trò
  async getTaiKhoanNhomVaiTro(
    searchFilter: FilterQueryStringTypeItem[] = [],
    params?: any
  ): Promise<TaiKhoanNhomVaiTroResponseGetItem> {
    if (params && Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      return this.getWithParams(`${this.additionPath}`, queryParams);
    }
    return this.getWithFilter(`${this.additionPath}`, searchFilter);
  }
}

const PhanQuyenServices = new PhanQuyenServicesBase();
export default PhanQuyenServices;
