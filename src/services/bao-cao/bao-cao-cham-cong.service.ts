/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import { TuyenDungResponseGetItem } from "@/dtos/tac-vu-nhan-su/tuyen-dung/tuyen-dung.response.dto";

class BaoCaoChamCongServicesBase extends AxiosService {
  protected readonly basePath = "/v1/recruitment";

  async getTimekeepingReport(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<TuyenDungResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}/lich-hen/danh-sach-ung-vien-buoi-phong-van`,
      searchFilter,
      quickSearchText,
      params
    );
  }
}

const BaoCaoChamCongServices = new BaoCaoChamCongServicesBase();
export default BaoCaoChamCongServices;
