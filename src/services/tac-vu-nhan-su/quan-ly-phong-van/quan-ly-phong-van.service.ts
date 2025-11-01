/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import { CreateInterviewReportRequest } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/interview.request.dto";
import { TuyenDungResponseGetItem } from "@/dtos/tac-vu-nhan-su/tuyen-dung/tuyen-dung.response.dto";
interface UpdatePhongVanRequest {
  appointmentId: string;
  listInterviewerId: string[];
  status: "ACCEPTED" | "REJECTED";
  reason?: string;
}
class QuanLyPhongVanServicesBase extends AxiosService {
  protected readonly basePath = "/v1/recruitment";

  updateLichPhongVan = async (data: UpdatePhongVanRequest): Promise<any> => {
    return this.post(`${this.basePath}/lich-hen/cap-nhat-hen-phong-van`, data);
  };
  async getUngVien(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<TuyenDungResponseGetItem> {
    return this.getWithFilter(
      `/v1/recruitment/lich-hen/danh-sach-ung-vien-buoi-phong-van`,
      searchFilter,
      quickSearchText,
      params
    );
  }
  createReport = async (data: CreateInterviewReportRequest): Promise<any> => {
    return this.post(`/v1/recruitment/lich-hen/report-buoi-phong-van`, data);
  };
}

const QuanLyPhongVanServices = new QuanLyPhongVanServicesBase();
export default QuanLyPhongVanServices;
