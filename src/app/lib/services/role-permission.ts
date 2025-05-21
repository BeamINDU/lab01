import { api } from '@/app/utils/api'
import type { UserPermission } from "@/app/types/user-permissions"
import { Menu, Action } from "@/app/lib/constants/menu"

// Sample menu data for testing
const allMenuData: UserPermission[] = [
  { menuId: "DB000", parentId: "", menuName: "Dashboard", icon: "", seq: 1, path: "/dashboard", actions: [1] },
  { menuId: "LI000", parentId: "", menuName: "Live inspection view", icon: "", seq: 2, path: "", actions: [1] },
  { menuId: "L001", parentId: "LI000", menuName: "Line Packing 1", icon: "", seq: 1, path: "", actions: [1] },
  { menuId: "CAM1", parentId: "L001", menuName: "CAM 1 Identify", icon: "", seq: 1, path: "/live/cam1", actions: [1] },
  { menuId: "CAM2", parentId: "L001", menuName: "CAM 2 Defect Detection", icon: "", seq: 2, path: "/live/2", actions: [1] },
  { menuId: "L002", parentId: "LI000", menuName: "Line Packing 2", icon: "", seq: 2, path: "", actions: [1] },
  { menuId: "CAM3", parentId: "L002", menuName: "CAM 3", icon: "", seq: 1, path: "/live/3", actions: [1] },
  { menuId: "CAM4", parentId: "L002", menuName: "CAM 4", icon: "", seq: 2, path: "/live/4", actions: [1] },
  { menuId: "MD000", parentId: "", menuName: "Master data", icon: "", seq: 3, path: "", actions: [1,3] },
  { menuId: "MD001", parentId: "MD000", menuName: "Product", icon: "", seq: 1, path: "/master-data/product", actions: [1, 2, 3, 4, 5] },
  { menuId: "MD002", parentId: "MD000", menuName: "Product Type", icon: "", seq: 2, path: "/master-data/product-type", actions: [1, 2, 3, 4, 5] },
  { menuId: "MD003", parentId: "MD000", menuName: "Defect Type", icon: "", seq: 3, path: "/master-data/defect-type", actions: [1, 2, 3, 4, 5] },
  { menuId: "MD004", parentId: "MD000", menuName: "Camera", icon: "", seq: 4, path: "/master-data/camera", actions: [1, 2, 3, 4, 5] },
  { menuId: "MD005", parentId: "MD000", menuName: "User", icon: "", seq: 5, path: "/master-data/user", actions: [1, 2, 3, 4, 5] },
  { menuId: "MD006", parentId: "MD000", menuName: "Role", icon: "", seq: 6, path: "/master-data/role", actions: [1, 2, 3, 4, 5] },
  { menuId: "RP000", parentId: "", menuName: "Report", icon: "", seq: 4, path: "", actions: [1] },
  { menuId: "RP001", parentId: "RP000", menuName: "Product Defect Result", icon: "", seq: 1, path: "/report/product-defect", actions: [1, 6] },
  { menuId: "RP002", parentId: "RP000", menuName: "Defect Summary", icon: "", seq: 2, path: "/report/defect-summary", actions: [1, 6] },
  { menuId: "RP003", parentId: "RP000", menuName: "Transaction", icon: "", seq: 3, path: "/report/transaction", actions: [1, 6] },
  { menuId: "PL000", parentId: "", menuName: "Planning", icon: "", seq: 6, path: "/planning", actions: [1, 2, 3, 4, 5, 6] },
  { menuId: "DM000", parentId: "", menuName: "Detection Model", icon: "", seq: 5, path: "/detection-model", actions: [1, 2, 3, 4] },
];

/**
 * Get all available menus with their permissions
 */
export const getAllMenus = async (): Promise<UserPermission[]> => {
  
  return allMenuData;
};

/**
 * Get permissions for a specific role
 */
export const getRolePermissions = async (roleId: string): Promise<{menuId: string, actions: number[]}[]> => {
  // Mock data - in a real app this would fetch from API
  return [
    { menuId: "DB000", actions: [1] },
    { menuId: "LI000", actions: [1] },
    { menuId: "MD001", actions: [1, 2, 3, 4, 5] },
    { menuId: "MD002", actions: [1] }
  ];
};

/**
 * Save permissions for a role
 */
export const saveRolePermissions = async (
  roleId: string, 
  permissions: {menuId: string, actions: number[]}[]
): Promise<{roleId: string, permissions: {menuId: string, actions: number[]}[]}> => {
  // In a real app, this would be an API call
  console.log("Saving permissions for role", roleId, permissions);
  
  return {
    roleId,
    permissions
  };
};