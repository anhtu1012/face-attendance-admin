/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import { SalaryReportResponse } from "@/dtos/bao-cao/bao-cao-luong/bao-cao-luong.response.dto";
import { MonthlySalaryDetailResponse } from "@/dtos/bao-cao/bao-cao-luong/daily-salary-detail.dto";

class BaoCaoSalaryServicesBase extends AxiosService {
  protected readonly basePath = "/v1/report";

  async getSalaryReport(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<SalaryReportResponse> {
    return this.getWithFilter(
      `${this.basePath}/bao-cao-luong`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  async getMonthlySalaryDetail(
    params?: Record<string, string | number | boolean>
  ): Promise<MonthlySalaryDetailResponse> {
    return this.getWithFilter(
      `/v1/time-keeping/tong-ket-luong`,
      [],
      undefined,
      params
    );
  }
}

const BaoCaoSalaryServices = new BaoCaoSalaryServicesBase();
export default BaoCaoSalaryServices;
