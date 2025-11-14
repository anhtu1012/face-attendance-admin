/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import { QuanlyDonTuResponseGetItem } from "@/dtos/tac-vu-nhan-su/quan-ly-don-tu/application.response.dto";

class QuanLyDonTuServicesBase extends AxiosService {
  protected readonly basePath = "/v1/form/quan-li-don";

  async getQuanLyDonTu(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<QuanlyDonTuResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}/danh-sach-don`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  async getQuanLyDonTuById(id: string): Promise<any> {
    return this.get<any>(`${this.basePath}/danh-sach-don/${id}`);
  }
}

const QuanLyDonTuServices = new QuanLyDonTuServicesBase();
export default QuanLyDonTuServices;
