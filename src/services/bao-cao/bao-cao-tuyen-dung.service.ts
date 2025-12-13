/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  RecruitmentReportFilterRequest,
  RecruitmentReportResponse,
} from "@/dtos/bao-cao/bao-cao-tuyen-dung/bao-cao-tuyen-dung.dto";

class BaoCaoTuyenDungServicesBase extends AxiosService {
  protected readonly basePath = "/v1/recruitment/reports";

  /**
   * Lấy báo cáo tổng quan tuyển dụng
   */
  async getRecruitmentReport(
    filter?: RecruitmentReportFilterRequest
  ): Promise<RecruitmentReportResponse> {
    return this.post(`${this.basePath}/overview`, filter || {});
  }

  /**
   * Lấy thống kê tuyển dụng theo tháng
   */
  async getMonthlyStatistics(
    year: number,
    month: number
  ): Promise<RecruitmentReportResponse> {
    return this.get(`${this.basePath}/monthly?year=${year}&month=${month}`);
  }

  /**
   * Lấy xu hướng tuyển dụng theo thời gian
   */
  async getRecruitmentTrends(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<any> {
    return this.getWithFilter(
      `${this.basePath}/trends`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  /**
   * Lấy thống kê theo vị trí tuyển dụng
   */
  async getJobPositionStatistics(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<any> {
    return this.getWithFilter(
      `${this.basePath}/job-positions`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  /**
   * Lấy thống kê theo phòng ban
   */
  async getDepartmentStatistics(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<any> {
    return this.getWithFilter(
      `${this.basePath}/departments`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  /**
   * Lấy thống kê nguồn ứng viên
   */
  async getCandidateSourceStatistics(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<any> {
    return this.getWithFilter(
      `${this.basePath}/candidate-sources`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  /**
   * Lấy top ứng viên
   */
  async getTopCandidates(
    limit: number = 10,
    params?: Record<string, string | number | boolean>
  ): Promise<any> {
    const queryObj: Record<string, string> = {};
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) {
          queryObj[k] = String(v);
        }
      }
    }
    queryObj.limit = String(limit);
    const queryString = new URLSearchParams(queryObj).toString();
    return this.get(
      `${this.basePath}/top-candidates${queryString ? `?${queryString}` : ""}`
    );
  }

  /**
   * Lấy thống kê kỹ năng
   */
  async getSkillDemandStatistics(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<any> {
    return this.getWithFilter(
      `${this.basePath}/skill-demand`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  /**
   * Lấy hiệu suất recruiter
   */
  async getRecruiterPerformance(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<any> {
    return this.getWithFilter(
      `${this.basePath}/recruiter-performance`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  /**
   * Export báo cáo ra Excel
   */
  async exportRecruitmentReport(
    filter?: RecruitmentReportFilterRequest
  ): Promise<Blob> {
    return this.post(`${this.basePath}/export`, filter || {}, {
      responseType: "blob",
    });
  }

  /**
   * Lấy so sánh tuyển dụng giữa các kỳ
   */
  async getComparisonReport(
    startPeriod: string,
    endPeriod: string,
    compareWith: string
  ): Promise<any> {
    return this.get(
      `${this.basePath}/comparison?start=${startPeriod}&end=${endPeriod}&compare=${compareWith}`
    );
  }
}

const BaoCaoTuyenDungServices = new BaoCaoTuyenDungServicesBase();
export default BaoCaoTuyenDungServices;
