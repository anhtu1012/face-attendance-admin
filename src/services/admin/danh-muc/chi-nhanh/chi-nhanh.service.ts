/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import { CreateBranchRequest } from "@/dtos/danhMuc/chi-nhanh/chinhanh.request.dto";
import { DanhMucBranchResponseGetItem } from "@/dtos/danhMuc/chi-nhanh/chinhanh.response.dto";

class DanhMucChiNhanhServiceBase extends AxiosService {
    private readonly basePath = "v1/branch"
    async getBranchs(
        searchFilter: FilterQueryStringTypeItem[] = [], 
        params?: any
    ): Promise<DanhMucBranchResponseGetItem> {
        return this.getWithFilter(this.basePath, searchFilter, params)
    }

    async createBranch(branch: CreateBranchRequest): Promise<any>{
        return this.post(this.basePath, branch)
    }
    async updateBranch(branchId: string, branchInfo: CreateBranchRequest ){
        return this.put(`${this.basePath}/${branchId}`, branchInfo)
    }
    async deleteBranch(branchId: string){
        return this.delete(`${this.basePath}/${branchId}`)
    }
}

export const DanhMucChiNhanhService = new DanhMucChiNhanhServiceBase()