/* eslint-disable @typescript-eslint/no-explicit-any */

export interface TreeNode<T = any> extends Record<string, any> {
  id: string;
  children?: TreeNode<T>[];
  isParent?: boolean;
  level?: number;
  expanded?: boolean;
  // Thêm các field phổ biến trong phân quyền
  createdAt?: string;
  updatedAt?: string;
  resourceCode?: string;
  resourceName?: string;
  parentName?: string;
  scopes?: string[];
  // Scope checkboxes
  view?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
  all?: boolean;
}

export interface TreeDataConfig {
  parentField: string; // Tên field để group (vd: 'parentName')
  idField?: string; // Tên field ID (default: 'id')
  scopesField?: string; // Tên field chứa array scopes (vd: 'scopes')
}

//#region CONVERT TREE DATA
/**
 * Chuyển đổi dữ liệu từ flat list thành tree structure
 * @param flatData - Dữ liệu dạng flat list
 * @param config - Cấu hình để xác định field group và scope
 * @returns Tree data structure
 */
export function convertToTreeData<T extends Record<string, any>>(
  flatData: T[],
  config: TreeDataConfig
): TreeNode<T>[] {
  if (!flatData || flatData.length === 0) {
    return [];
  }

  const { parentField, idField = "id", scopesField = "scopes" } = config;

  // Tạo Map để nhóm các item theo parent field
  const groupedByParent: Map<string, T[]> = new Map();

  // Duyệt qua từng item để lấy ra parent giống nhau -> set làm parent chung cho nhóm đó
  flatData.forEach((item) => {
    const parentValue = item[parentField] || "Unknown";
    if (!groupedByParent.has(parentValue)) {
      groupedByParent.set(parentValue, []);
    }
    groupedByParent.get(parentValue)!.push(item);
  });

  const treeData: TreeNode<T>[] = [];

  // Duyệt qua từng nhóm parent để tạo tree structure
  groupedByParent.forEach((children, parentValue) => {
    if (children.length === 1) {
      // Nếu chỉ có 1 item trong group, có thể là parent hoặc standalone item
      const item = children[0];
      const processedItem = processScopesToCheckboxes(item, scopesField);

      treeData.push({
        ...processedItem,
        id: item[idField] || `single_${parentValue}`,
        isParent: false,
        level: 0,
        expanded: false,
        children: [],
      });
    } else {
      // Nếu có nhiều hơn 1 item, tạo parent node và children
      const processedChildren = children.map((child, index) => {
        const processedChild = processScopesToCheckboxes(child, scopesField);
        return {
          ...processedChild,
          id: child[idField] || `child_${parentValue}_${index}`,
          isParent: false,
          level: 1,
          expanded: false,
          children: [],
        };
      });

      // Tính toán checkbox của parent dựa trên children
      const parentCheckboxes = calculateParentCheckboxes(processedChildren);

      const parentNode: TreeNode<T> = {
        id: `parent_${parentValue}`,
        [parentField]: parentValue,
        isParent: true,
        level: 0,
        expanded: false,
        children: processedChildren,
        // Thêm checkbox states cho parent
        ...parentCheckboxes,
      };

      treeData.push(parentNode);
    }
  });

  return treeData;
}
//#endregion

//#region SCOPES CHECKBOX LOGIC
/**
 * Xử lý scopes array thành các checkbox boolean
 * @param item - Item cần xử lý
 * @param scopesField - Tên field chứa scopes array
 * @returns Item với scopes đã được tách thành checkbox
 */
function processScopesToCheckboxes<T extends Record<string, any>>(
  item: T,
  scopesField: string
): T & {
  view?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
  all?: boolean;
} {
  const scopes = (item[scopesField] as string[]) || [];

  const view = scopes.includes("view");
  const create = scopes.includes("create");
  const update = scopes.includes("update");
  const deleteScope = scopes.includes("delete");

  // All được tick khi có đầy đủ 4 scopes: view, create, update, delete
  const all = view && create && update && deleteScope;

  return {
    ...item,
    view,
    create,
    update,
    delete: deleteScope,
    all,
  };
}
//#endregion

//#region PARENT CHECKBOX LOGIC
/**
 * Tính toán checkbox của parent dựa trên trạng thái của children
 * @param children - Array các child nodes
 * @returns Object chứa trạng thái checkbox của parent
 */
function calculateParentCheckboxes<T>(children: TreeNode<T>[]): {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  all: boolean;
} {
  if (!children || children.length === 0) {
    return {
      view: false,
      create: false,
      update: false,
      delete: false,
      all: false,
    };
  }

  // Kiểm tra xem tất cả children có checkbox tương ứng được tick không
  const allChildrenHaveView = children.every((child) => child.view === true);
  const allChildrenHaveCreate = children.every(
    (child) => child.create === true
  );
  const allChildrenHaveUpdate = children.every(
    (child) => child.update === true
  );
  const allChildrenHaveDelete = children.every(
    (child) => child.delete === true
  );
  const allChildrenHaveAll = children.every((child) => child.all === true);

  return {
    view: allChildrenHaveView,
    create: allChildrenHaveCreate,
    update: allChildrenHaveUpdate,
    delete: allChildrenHaveDelete,
    all: allChildrenHaveAll,
  };
}
//#endregion

//#region FLATTEN DATA DISPLAY
/**
 * Flatten tree data để hiển thị trong AgGrid
 * @param treeData - Tree data structure
 * @returns Flat array with expanded nodes
 */
export function flattenTreeData<T>(treeData: TreeNode<T>[]): TreeNode<T>[] {
  const result: TreeNode<T>[] = [];

  function traverse(nodes: TreeNode<T>[], level = 0) {
    nodes.forEach((node) => {
      result.push({
        ...node,
        level,
      });

      if (node.expanded && node.children && node.children.length > 0) {
        traverse(node.children, level + 1);
      }
    });
  }

  traverse(treeData);
  return result;
}
//#endregion

//#region EXPAND/COLLAPSE
/**
 * Toggle expand/collapse của một node
 * @param treeData - Current tree data
 * @param nodeId - ID của node cần toggle
 * @returns Updated tree data
 */
export function toggleNodeExpansion<T>(
  treeData: TreeNode<T>[],
  nodeId: string
): TreeNode<T>[] {
  function updateNode(nodes: TreeNode<T>[]): TreeNode<T>[] {
    return nodes.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          expanded: !node.expanded,
        };
      }

      if (node.children) {
        return {
          ...node,
          children: updateNode(node.children),
        };
      }

      return node;
    });
  }

  return updateNode(treeData);
}
//#endregion

//#region UPDATE CHECKBOX
/**
 * Cập nhật checkbox state cho một node trong tree data
 * @param treeData - Current tree data
 * @param nodeId - ID của node cần update
 * @param field - Field checkbox cần update (view, create, update, delete, all)
 * @param checked - Giá trị checkbox mới
 * @returns Updated tree data
 */
export function updateNodeCheckbox<T>(
  treeData: TreeNode<T>[],
  nodeId: string,
  field: "view" | "create" | "update" | "delete" | "all",
  checked: boolean
): TreeNode<T>[] {
  // Bước 1: Tìm và update target node trước
  function updateTargetNode(nodes: TreeNode<T>[]): TreeNode<T>[] {
    return nodes.map((node) => {
      if (node.id === nodeId) {
        let updatedNode = { ...node };

        if (updatedNode.isParent) {
          // Parent node logic
          if (field === "all") {
            updatedNode = {
              ...updatedNode,
              all: checked,
              view: checked,
              create: checked,
              update: checked,
              delete: checked,
              children:
                updatedNode.children?.map((child) => ({
                  ...child,
                  all: checked,
                  view: checked,
                  create: checked,
                  update: checked,
                  delete: checked,
                })) || [],
            };
          } else {
            updatedNode = {
              ...updatedNode,
              [field]: checked,
              children:
                updatedNode.children?.map((child) => ({
                  ...child,
                  [field]: checked,
                  all:
                    (field === "view" ? checked : child.view || false) &&
                    (field === "create" ? checked : child.create || false) &&
                    (field === "update" ? checked : child.update || false) &&
                    (field === "delete" ? checked : child.delete || false),
                })) || [],
            };

            const view = field === "view" ? checked : updatedNode.view || false;
            const create =
              field === "create" ? checked : updatedNode.create || false;
            const update =
              field === "update" ? checked : updatedNode.update || false;
            const deleteScope =
              field === "delete" ? checked : updatedNode.delete || false;
            updatedNode.all = view && create && update && deleteScope;
          }
        } else {
          // Child node logic
          if (field === "all") {
            updatedNode = {
              ...updatedNode,
              all: checked,
              view: checked,
              create: checked,
              update: checked,
              delete: checked,
            };
          } else {
            updatedNode = {
              ...updatedNode,
              [field]: checked,
            };

            const view = field === "view" ? checked : updatedNode.view || false;
            const create =
              field === "create" ? checked : updatedNode.create || false;
            const update =
              field === "update" ? checked : updatedNode.update || false;
            const deleteScope =
              field === "delete" ? checked : updatedNode.delete || false;
            updatedNode.all = view && create && update && deleteScope;
          }
        }

        return updatedNode;
      }

      // Recursively check children
      if (node.children) {
        return {
          ...node,
          children: updateTargetNode(node.children),
        };
      }

      return node;
    });
  }

  // Bước 2: Update parent checkboxes dựa trên children
  function updateParentCheckboxes(nodes: TreeNode<T>[]): TreeNode<T>[] {
    return nodes.map((node) => {
      if (node.isParent && node.children && node.children.length > 0) {
        const parentCheckboxes = calculateParentCheckboxes(node.children);
        return {
          ...node,
          ...parentCheckboxes,
          children: updateParentCheckboxes(node.children),
        };
      }

      if (node.children) {
        return {
          ...node,
          children: updateParentCheckboxes(node.children),
        };
      }

      return node;
    });
  }

  // Thực hiện 2 bước tuần tự
  const step1Result = updateTargetNode(treeData);
  const step2Result = updateParentCheckboxes(step1Result);

  return step2Result;
}
//#endregion
