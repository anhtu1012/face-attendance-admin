/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import { CauHinhMenuResponseGetItem } from "@/dtos/quan-tri-he-thong/cau-hinh-menu/cau-hinh-menu.response.dto";

class CauHinhMenuServicesBase extends AxiosService {
  protected readonly basePath = "/v1/sa/resource";

  async getCauHinhMenu(
    searchFilter: FilterQueryStringTypeItem[] = [],
    params?: any
  ): Promise<CauHinhMenuResponseGetItem> {
    if (params && Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      return this.getWithParams(`${this.basePath}`, queryParams);
    }
    return this.getWithFilter(`${this.basePath}`, searchFilter);
  }

  async createCauHinhMenu(formData: {
    resourceCode: string;
    resourceName: string;
    parentName: string;
    scopes: string[];
    sort?: string;
  }): Promise<any> {
    return this.post(`${this.basePath}`, formData);
  }

  async updateCauHinhMenu(
    id: string | undefined,
    formData: {
      resourceCode: string;
      resourceName: string;
      parentName: string;
      scopes: string[];
      sort?: string;
    }
  ): Promise<any> {
    return this.put(`${this.basePath}/${id}`, formData);
  }

  async deleteCauHinhMenu(
    id: string,
    status: { status: string }
  ): Promise<any> {
    return this.delete(`${this.basePath}/${id}`, status);
  }
}

const CauHinhMenuServices = new CauHinhMenuServicesBase();
export default CauHinhMenuServices;
