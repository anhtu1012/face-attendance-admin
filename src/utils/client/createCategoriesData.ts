import { ResourcePermission } from "@/dtos/auth/auth.dto";
import { JSX } from "react";

// Updated PermisionItem interface to match the new data structure

interface JsonData {
  permission: ResourcePermission[];
}

interface ModuleData {
  title: string;
  icon?: JSX.Element;
  order: number;
  link: string | null;
}

interface Category {
  // icon: JSX.Element | undefined;
  title: string;
  link: string;
}

interface CategoriesData {
  [key: string]: Category[];
}

interface SortedModuleData {
  [key: string]: ModuleData;
}

export const createCategoriesData = (
  jsonData: JsonData
): { categoriesData: CategoriesData; moduleData: SortedModuleData } => {
  const categoriesData: CategoriesData = {};
  const moduleData: SortedModuleData = {};

  jsonData.permission.forEach((permissionItem) => {
    const resourceCode = permissionItem.resourceCode;
    const status = permissionItem.scopes;
    const parentName = permissionItem.parentName;
    const resourceName = permissionItem.resourceName;

    // Kiểm tra nếu menu có quyền view
    if (
      status &&
      Array.isArray(status) &&
      status.some((item) => item.toLowerCase().includes("view".toLowerCase()))
    ) {
      const splitCode = resourceCode.split("/");
      const groupKey = splitCode[0]; // Lấy key của nhóm (vd: quan_tri)

      // Sử dụng parentName làm groupKeyFormatted thay vì từ đường dẫn
      const groupKeyFormatted = parentName;

      const categoryTitle = resourceName;

      // Gán tiêu đề và icon từ groupMapping hoặc từ data mới
      moduleData[groupKeyFormatted] = moduleData[groupKeyFormatted] || {
        title: parentName || groupKeyFormatted,
        link: `/${resourceCode}`,
      };

      if (splitCode.length > 1) {
        const category: Category = {
          title: categoryTitle,
          link: `/${resourceCode}`,
        };

        if (!categoriesData[groupKeyFormatted]) {
          categoriesData[groupKeyFormatted] = [];
        }

        categoriesData[groupKeyFormatted].push(category);

        // Điều chỉnh link dựa trên số lượng phân mục
        if (categoriesData[groupKeyFormatted].length === 1) {
          moduleData[groupKeyFormatted].link = `/${groupKey}`;
        } else if (categoriesData[groupKeyFormatted].length >= 0) {
          moduleData[groupKeyFormatted].link = null;
        }
      }
    }
  });

  return { categoriesData, moduleData };
};
