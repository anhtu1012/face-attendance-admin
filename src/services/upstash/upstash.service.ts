/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "../../apis/axios.base";

class UpstashServicesBase extends AxiosService {
  protected readonly basePath = "/api";
  //tăng views
  incrementViews = async (jobId: string): Promise<{ views?: number } | any> => {
    // POST to /api/views with a JSON body { jobId }
    return this.post(`${this.basePath}/views`, { jobId });
  };
}

const UpstashServices = new UpstashServicesBase();
export default UpstashServices;
