/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import { TimekeepingReportData } from "@/dtos/bao-cao/bao-cao-cham-cong/bao-cao-cham-cong.dto";
import {
  TimekeepingDetailReportResponse,
  TimekeepingReportResponse,
} from "@/dtos/bao-cao/bao-cao-cham-cong/bao-cao-cham-cong.response.dto";
class BaoCaoChamCongServicesBase extends AxiosService {
  protected readonly basePath = "/v1/report";

  async getTimekeepingReport(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<TimekeepingReportResponse> {
    return this.getWithFilter(
      `${this.basePath}/bao-cao-cham-cong`,
      searchFilter,
      quickSearchText,
      params
    );
  }
  async getTimekeepingReportByUser(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<TimekeepingReportData> {
    return this.getWithFilter(
      `/v1/time-keeping/thong-ke-cham-cong`,
      searchFilter,
      quickSearchText,
      params
    );
  }
  async getTimekeepingReportByUserAll(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<TimekeepingReportData> {
    return this.getWithFilter(
      `/v1/report/timekeeping-of-staff`,
      searchFilter,
      quickSearchText,
      params
    );
  }
  async getTimekeepingReportDetail(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<TimekeepingDetailReportResponse> {
    return this.getWithFilter(
      `/v1/time-keeping/danh-sach-cham-cong`,
      searchFilter,
      quickSearchText,
      params
    );
  }
}

const BaoCaoChamCongServices = new BaoCaoChamCongServicesBase();
export default BaoCaoChamCongServices;
