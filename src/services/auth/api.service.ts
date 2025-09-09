import { AxiosService } from "@/apis/axios.base";
import { ValidateBaseClass } from "@/apis/ddd/validate.class.base";

import {
  UserRequestLoginItem,
  UserRequestLoginSchema,
  UserRequestRegisterItem,
  UserRequestRegisterSchema,
} from "@/dtos/auth/auth.request.dto";
import {
  UserResponseLoginItem,
  UserResponseLogoutItem,
  UserResponseRegisterItem,
} from "@/dtos/auth/auth.response.dto";

class AuthServicesBase extends AxiosService {
  protected readonly basePath = "/v1/auth";

  async login(formData: UserRequestLoginItem): Promise<UserResponseLoginItem> {
    await ValidateBaseClass.validate(formData, UserRequestLoginSchema);
    return this.post(`${this.basePath}/login`, formData);
  }

  async register(
    formData: UserRequestRegisterItem
  ): Promise<UserResponseRegisterItem> {
    await ValidateBaseClass.validate(formData, UserRequestRegisterSchema);
    return this.post(`${this.basePath}/register`, formData);
  }

  async logout(): Promise<UserResponseLogoutItem> {
    return this.post(`${this.basePath}/logout`, {});
  }
}

const AuthServices = new AuthServicesBase();
export default AuthServices;
