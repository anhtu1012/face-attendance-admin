import { CreateAppointmentRequest } from "./../../../dtos/tac-vu-nhan-su/phong-van-nhan-viec/interview.dto";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  AppointmentListWithInterviewGetItem,
  AppointmentResponseGetItem,
} from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/interview.response.dto";
import { CreateJobOfferRequest } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/job-offer.dto";
import {
  CreateTuyenDungRequest,
  UpdateTuyenDungRequest,
} from "@/dtos/tac-vu-nhan-su/tuyen-dung/tuyen-dung.request.dto";
import {
  NguoiPhongVanResponseGetItem,
  TuyenDungResponseGetItem,
} from "@/dtos/tac-vu-nhan-su/tuyen-dung/tuyen-dung.response.dto";

class TuyenDungServicesBase extends AxiosService {
  protected readonly basePath = "/v1/recruitment";

  async getSeting(): Promise<any> {
    return this.getWithFilter(`/v1/company/public-system-setting`);
  }
  async getTuyenDung(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<TuyenDungResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}/tuyen-dung`,
      searchFilter,
      quickSearchText,
      params
    );
  }
  async getNguoiPhongVan(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<NguoiPhongVanResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}/tuyen-dung/nguoi-phong-van`,
      searchFilter,
      quickSearchText,
      params
    );
  }
  async getDanhSachPhongVan(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<AppointmentResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}/lich-hen/lich-hen-ung-vien`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  async getDanhSachPhongVanWithParam(
    searchFilter: FilterQueryStringTypeItem[] = [],
    quickSearchText: string | undefined = undefined,
    params?: Record<string, string | number | boolean>
  ): Promise<AppointmentListWithInterviewGetItem> {
    return this.getWithFilter(
      `${this.basePath}/lich-hen/danh-sach-phong-van-ung-vien`,
      searchFilter,
      quickSearchText,
      params
    );
  }

  createTuyenDung = async (data: CreateTuyenDungRequest): Promise<any> => {
    const payload = {
      payload: data,
    };
    return this.post(`${this.basePath}`, payload);
  };

  async updateTuyenDung(payload: UpdateTuyenDungRequest): Promise<any> {
    return this.put(`${this.basePath}`, payload);
  }

  async updateStatusUngVien(
    id: string,
    status:
      | "TO_INTERVIEW"
      | "CANNOT_CONTACT"
      | "INTERVIEW_REJECTED"
      | "CONTRACT_SIGNING"
      | "HOAN_THANH"
  ): Promise<any> {
    return this.put(`${this.basePath}/tuyen-dung/update-status/${id}`, {
      status,
    });
  }

  async deleteTuyenDung(id: string): Promise<any> {
    return this.delete(`${this.basePath}/${id}`);
  }

  async createAppointment(data: CreateAppointmentRequest): Promise<any> {
    return this.post(`${this.basePath}/tuyen-dung/tao-cuoc-hen`, data);
  }
  async addCandidatesAppointment(
    id: string,
    data: {
      listIntervieweeId: string[];
    }
  ): Promise<any> {
    return this.post(
      `${this.basePath}/tuyen-dung/them-ung-vien-lich-hen/${id}`,
      data
    );
  }

  async createOffer(data: CreateJobOfferRequest): Promise<any> {
    return this.post(
      `${this.basePath}/tuyen-dung/tao-lich-hen-nhan-viec`,
      data
    );
  }

  async checkMailExists(listParticipantIds: string[]): Promise<any> {
    const payload = { participantIds: listParticipantIds };
    return this.post(`${this.basePath}/lich-hen/check-mail-ung-vien`, payload);
  }
}

const TuyenDungServices = new TuyenDungServicesBase();
export default TuyenDungServices;
