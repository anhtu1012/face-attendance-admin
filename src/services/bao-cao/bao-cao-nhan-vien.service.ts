/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";

class BaoCaoStaffServicesBase extends AxiosService {
  //   protected readonly basePath = "/v1/report";

  async getTotalStaffInDepartReport(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<any> {
    return this.getWithFilter(
      `/v1/sa/user/total-employee-in-department`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  async getTotalStaffInPosition(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<any> {
    return this.getWithFilter(
      `/v1/sa/user/total-employee-in-position`,
      searchFilter,
      quickSearchText,
      params
    );
  }
}

const BaoCaoStaffServices = new BaoCaoStaffServicesBase();
export default BaoCaoStaffServices;
