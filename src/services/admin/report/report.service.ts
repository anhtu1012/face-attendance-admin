/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosService } from "@/apis/axios.base";

class RepositoryPortServicesBase extends AxiosService {
  protected readonly basePath = "/v1/business";

  async getReport(params?: any): Promise<any> {
    return this.getWithParams(`${this.basePath}/find-report`, params);
  }
}

const RepositoryPortServices = new RepositoryPortServicesBase();
export default RepositoryPortServices;
