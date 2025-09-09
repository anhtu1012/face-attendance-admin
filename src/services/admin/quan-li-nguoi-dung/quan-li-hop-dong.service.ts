/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { ValidateBaseClass } from "@/apis/ddd/validate.class.base";
import {
  CreateContractFormSchema,
  UpdateContractFormSchema,
} from "@/dtos/quan-li-nguoi-dung/contracts/contract.dto";
import {
  CreateContractFormRequest,
  UpdateContractFormRequest,
} from "@/dtos/quan-li-nguoi-dung/contracts/contract.request.dto";
import { UserContractResponseGetItem } from "@/dtos/quan-li-nguoi-dung/contracts/contract.response.dto";

class QuanLyHopDongServicesBase extends AxiosService {
  protected readonly basePath = "/v1/business";

  async getContractById(id: string): Promise<any> {
    return this.get(`${this.basePath}/${id}`);
  }

  async createContract(formData: CreateContractFormRequest): Promise<any> {
    await ValidateBaseClass.validate(formData, CreateContractFormSchema);

    // Check if there's a file to upload
    if (formData.contractPdf instanceof File) {
      const formDataObj = new FormData();

      // Add all fields to FormData
      Object.keys(formData).forEach((key) => {
        const value = (formData as any)[key];
        if (key === "contractPdf" && value instanceof File) {
          formDataObj.append(key, value);
        } else if (key === "branchCodes" && Array.isArray(value)) {
          value.forEach((code: string) =>
            formDataObj.append("branchCodes[]", code)
          );
        } else if (value !== undefined && value !== null) {
          formDataObj.append(key, value.toString());
        }
      });

      return this.post(
        `${this.basePath}/create-contract-with-branch`,
        formDataObj
      );
    } else {
      // No file, send as regular JSON
      return this.post(
        `${this.basePath}/create-contract-with-branch`,
        formData
      );
    }
  }

  async updateContract(
    id: string,
    formData: UpdateContractFormRequest
  ): Promise<any> {
    await ValidateBaseClass.validate(formData, UpdateContractFormSchema);

    // Check if there's a file to upload
    if (formData.contractPdf instanceof File) {
      const formDataObj = new FormData();

      // Add all fields to FormData
      Object.keys(formData).forEach((key) => {
        const value = (formData as any)[key];
        if (key === "contractPdf" && value instanceof File) {
          formDataObj.append(key, value);
        } else if (key === "branchCodes" && Array.isArray(value)) {
          value.forEach((code: string) =>
            formDataObj.append("branchCodes[]", code)
          );
        } else if (value !== undefined && value !== null) {
          formDataObj.append(key, value.toString());
        }
      });

      return this.put(`/v1/user-contract/${id}`, formDataObj);
    } else {
      // No file, send as regular JSON
      return this.put(`/v1/user-contract/${id}`, formData);
    }
  }

  async deleteContract(id: string): Promise<any> {
    return this.delete(`${this.basePath}/${id}`);
  }

  async getContractsByUserCode(
    userCode: string
  ): Promise<UserContractResponseGetItem> {
    return this.getWithFilter(`${this.basePath}/by-user-code/${userCode}`);
  }
  async getContractsByUserCodeHistory(
    userCode: string
  ): Promise<UserContractResponseGetItem[]> {
    return this.getWithFilter(
      `${this.basePath}/by-user-code-array/${userCode}`
    );
  }
}

const QuanLyHopDongServices = new QuanLyHopDongServicesBase();
export default QuanLyHopDongServices;
