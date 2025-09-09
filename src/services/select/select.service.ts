/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "../../apis/axios.base";
import { SelectOptionsArray } from "../../dtos/select/select.dto";

class SelectServicesBase extends AxiosService {
  protected readonly basePath = "/v1/dropdown";
  async getDanhMuc(id: string, maBrand?: string): Promise<SelectOptionsArray> {
    if (maBrand) {
      return this.getWithParams(
        `${this.basePath}/dropdown-user/${id}`,
        new URLSearchParams({ maBrand })
      );
    }
    return this.get(`${this.basePath}/dropdown-user/${id}`);
  }

  async getSelectBrand(userCode?: string): Promise<SelectOptionsArray[]> {
    if (userCode) {
      return this.getWithParams(
        `${this.basePath}/dropdown-branch`,
        new URLSearchParams({ userCode })
      );
    }
    return this.get(`${this.basePath}/dropdown-branch`);
  }

  async getSelectPosition(): Promise<SelectOptionsArray[]> {
    return this.get(`${this.basePath}/dropdown-position`);
  }

  //Ca làm
  async getSelectShift(): Promise<SelectOptionsArray[]> {
    return this.get(`${this.basePath}/dropdown-shift`);
  }

  // New methods for dependent dropdowns
  async getSelectManagers(
    branchCodes: string[],
    roleCode: string
  ): Promise<SelectOptionsArray> {
    const params = new URLSearchParams();
    // Add each branchCode as a separate parameter
    branchCodes.forEach((code) => params.append("branchCode", code));
    params.append("roleCode", roleCode);

    return this.getWithParams(`${this.basePath}/dropdown-user`, params);
  }

  async getSelectPositionByRole(roleCode: string): Promise<SelectOptionsArray> {
    return this.getWithParams(
      `${this.basePath}/dropdown-position`,
      new URLSearchParams({ roleCode })
    );
  }
}

const SelectServices = new SelectServicesBase();
export default SelectServices;
