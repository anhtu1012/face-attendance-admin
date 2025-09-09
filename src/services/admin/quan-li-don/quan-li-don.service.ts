/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidateBaseClass } from "@/apis/ddd/validate.class.base";

import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  UpdateFormStatusRequest,
  UpdateFormStatusSchema,
} from "@/dtos/quan-li-don/quan-li-don.request.dto";
import { FormResponseGetItem } from "@/dtos/quan-li-don/quan-li-don.response.dto";
import dayjs from "dayjs";

export interface FormSearchParams {
  quickSearch?: string;
  fromDate: dayjs.Dayjs;
  toDate: dayjs.Dayjs;
  formId?: string;
  [key: string]: string | dayjs.Dayjs | undefined;
}

class DanhMucDonServicesBase extends AxiosService {
  protected readonly basePath = "/v1/form-description";

  async filterDanhMucDon(
    searchFilter: FilterQueryStringTypeItem[] = [],
    params?: FormSearchParams
  ): Promise<FormResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}/filter`,
      searchFilter,
      params as Record<string, string>
    );
  }

  async updateFormStatus(
    id: string | undefined,
    formData: UpdateFormStatusRequest
  ): Promise<any> {
    await ValidateBaseClass.validate(formData, UpdateFormStatusSchema);
    return this.put(`${this.basePath}/${id}`, formData);
  }
}

const DanhMucDonServices = new DanhMucDonServicesBase();
export default DanhMucDonServices;
