/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FilterBuilder,
  FilterOperationType,
} from "@chax-at/prisma-filter-common";

interface ISingleFilter<T = any> {
  field: string;
  type: FilterOperationType;
  value: T;
}

interface ISingleOrder {
  field: string;
  dir: "asc" | "desc";
}

interface FilterQueryStringTypeItem {
  key: string;
  type: FilterOperationType;
  value: any;
  dir?: "asc" | "desc";
}

type FilterQueryStringType = FilterQueryStringTypeItem[];

export const filterQueryString = (
  listFilter: FilterQueryStringType,
  orderFilter: ISingleOrder[] = []
) => {
  const filter: ISingleFilter<any>[] = [];
  const order: ISingleOrder[] = [];

  listFilter.forEach((itemFilter) => {
    // Skip 'limit' and 'offset' keys as filter items since they're handled separately
    if (itemFilter.key !== "limit" && itemFilter.key !== "offset") {
      const filterItem: ISingleFilter<any> = {
        field: itemFilter.key,
        type: itemFilter.type,
        value: itemFilter.value,
      };
      filter.push(filterItem);
    }

    // Chỉ thêm order nếu có dir
    if (itemFilter.dir) {
      const orderItem: ISingleOrder = {
        field: itemFilter.key,
        dir: itemFilter.dir,
      };
      order.push(orderItem);
    }
  });

  // Kiểm tra xem trong filter đã có limit chưa
  const limitFilter = listFilter.find((item) => item.key === "limit");
  // Luôn đảm bảo có giá trị limit từ NEXT_PUBLIC_LIMIT_QUERY nếu không được truyền
  const limitValue = limitFilter
    ? parseInt(limitFilter.value, 10)
    : process.env.NEXT_PUBLIC_LIMIT_QUERY
    ? parseInt(process.env.NEXT_PUBLIC_LIMIT_QUERY, 10)
    : 10;

  // Kiểm tra xem trong filter đã có offset chưa
  const offsetFilter = listFilter.find((item) => item.key === "offset");
  const offsetValue = offsetFilter
    ? parseInt(offsetFilter.value, 10)
    : process.env.NEXT_PUBLIC_OFFSET_QUERY
    ? parseInt(process.env.NEXT_PUBLIC_OFFSET_QUERY, 10)
    : 0;

  return FilterBuilder.buildFilterQueryString({
    limit: limitValue,
    offset: offsetValue,
    filter,
    order: [...order, ...orderFilter],
  });
};
