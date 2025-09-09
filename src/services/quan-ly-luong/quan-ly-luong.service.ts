/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import { QuanLyLuongStatus } from "@/dtos/quan-ly-luong/quanLyLuong.dto";
import { PaginatedQuanLyLuongResponse } from "@/dtos/quan-ly-luong/quanLyLuong.response.dto";

class QuanLyLuongServicesBase extends AxiosService {
  protected readonly basePath = "/v1/business";

  async getQuanLyLuong(
    searchFilter: FilterQueryStringTypeItem[] = [],
    params?: any
  ): Promise<PaginatedQuanLyLuongResponse> {
    return this.getWithFilter(
      `${this.basePath}/bang-luong`,
      searchFilter,
      params
    );
  }
  async getQuanLyLuongByUserCode(
    searchFilter: FilterQueryStringTypeItem[] = [],
    params?: any
  ): Promise<PaginatedQuanLyLuongResponse> {
    return this.getWithFilter(
      `${this.basePath}/bang-luong`,
      searchFilter,
      params
    );
  }

  async updateQuanLyLuong(
    id: string,
    data: {
      status: QuanLyLuongStatus;
    }
  ): Promise<any> {
    return this.put(`${this.basePath}/thanh-toan-luong/${id}`, data);
  }
}

const QuanLyLuongServices = new QuanLyLuongServicesBase();
export default QuanLyLuongServices;
