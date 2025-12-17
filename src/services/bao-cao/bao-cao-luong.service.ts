/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  SalaryReportItem,
  SalaryReportResponse,
} from "@/dtos/bao-cao/bao-cao-luong/bao-cao-luong.response.dto";
import { MonthlySalaryDetailResponse } from "@/dtos/bao-cao/bao-cao-luong/daily-salary-detail.dto";
import { SalaryChartResponse } from "@/dtos/bao-cao/bao-cao-luong/salary-chart.response.dto";

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
  async getSalaryReportByUserAll(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<SalaryReportResponse> {
    return this.getWithFilter(
      `/v1/report/salary-of-staff`,
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

  async getSalaryChart(
    params?: Record<string, string | number | boolean>
  ): Promise<SalaryChartResponse> {
    return this.getWithFilter(
      `${this.basePath}/salary-chart`,
      [],
      undefined,
      params
    );
  }
  async getSalaryChartDepart(
    params?: Record<string, string | number | boolean>
  ): Promise<any> {
    return this.getWithFilter(
      `${this.basePath}/salary-chart-by-depart`,
      [],
      undefined,
      params
    );
  }
}

const BaoCaoSalaryServices = new BaoCaoSalaryServicesBase();
export default BaoCaoSalaryServices;
