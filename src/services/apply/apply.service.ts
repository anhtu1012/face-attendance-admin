/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "../../apis/axios.base";

class ApplyServicesBase extends AxiosService {
  protected readonly basePath = "/v1/recruitment";

  async getDetailJobApplication(code: string): Promise<any> {
    return this.get(
      `${this.basePath}/tuyen-dung/danh-sach-cong-viec/chi-tiet${code}`
    );
  }

  createRecruitmentMultipart = async (formData: FormData): Promise<any> => {
    return this.post(`${this.basePath}/tao-ung-vien`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  checkMailAndPhoneExist = async (
    email: string,
    phone: string
  ): Promise<any> => {
    return this.get(
      `${this.basePath}/kiem-tra-email-sdt?email=${email}&phone=${phone}`
    );
  };
}

const ApplyServices = new ApplyServicesBase();
export default ApplyServices;
