import { api } from '@/app/utils/api'
import { API_ROUTES } from '@/app/constants/endpoint';
import { extractErrorMessage } from '@/app/utils/errorHandler';
import type { User, UserPermission } from "@/app/types/user-permissions"
import { Menu, Action } from "@/app/constants/menu"

// Action
// View = 1,      // view
// Add = 2,       // add
// Edit = 3,      // edit
// Delete = 4,    // delete
// Upload = 5,    // upload
// Export = 6     // export

export const mockUserPermission: UserPermission[] = 
[
  { menuId: "DB000", parentId: "", menuName: "Dashboard", icon: "dashboard", seq:  1, path: "/dashboard", actions: [1] },
  { menuId: "LI000", parentId: "", menuName: "Live inspection view", icon: "live", seq: 2, path: "", actions: [1] },
  { menuId: "MD000", parentId: "", menuName: "Master data", icon: "settings", seq: 3, path: "", actions: [1,3] },
  { menuId: "MD001", parentId: "MD000", menuName: "Product", icon: "", seq: 1, path: "/master-data/product", actions: [1, 2, 3, 4, 5, 6] },
  { menuId: "MD002", parentId: "MD000", menuName: "Product Type", icon: "", seq: 2, path: "/master-data/product-type", actions: [1, 2, 3, 4, 5, 6] },
  { menuId: "MD003", parentId: "MD000", menuName: "Defect Type", icon: "", seq: 3, path: "/master-data/defect-type", actions: [1, 2, 3, 4, 5, 6] },
  { menuId: "MD004", parentId: "MD000", menuName: "Camera", icon: "", seq: 4, path: "/master-data/camera", actions: [1, 2, 3, 4, 5, 6] },
  { menuId: "MD005", parentId: "MD000", menuName: "User", icon: "", seq: 5, path: "/master-data/user", actions: [1, 2, 3, 4, 5, 6] },
  { menuId: "MD006", parentId: "MD000", menuName: "Role", icon: "", seq: 6, path: "/master-data/role", actions: [1, 2, 3, 4, 5, 6] },
  { menuId: "RP000", parentId: "", menuName: "Report", icon: "report", seq: 4, path: "", actions: [1] },
  { menuId: "RP001", parentId: "RP000", menuName: "Product Defect Result", icon: "", seq: 1, path: "/report/product-defect", actions: [1, 3, 6] },
  { menuId: "RP002", parentId: "RP000", menuName: "Defect Summary", icon: "", seq: 2, path: "/report/defect-summary", actions: [1, 6] },
  { menuId: "RP003", parentId: "RP000", menuName: "Transaction", icon: "", seq: 3, path: "/report/transaction", actions: [1, 6] },
  { menuId: "DM000", parentId: "", menuName: "Detection Model", icon: "detection", seq: 5, path: "/detection-model", actions: [1, 2, 3, 4, 5, 6] },
  { menuId: "PL000", parentId: "", menuName: "Planning", icon: "planning", seq: 6, path: "/planning", actions: [1, 2, 3, 4, 5, 6] },
  
  { menuId: "L001", parentId: "LI000", menuName: "Zone 1", icon: "", seq: 1, path: "", actions: [1] },
  { menuId: "CAM004", parentId: "L001", menuName: "Camera 4", icon: "", seq: 1, path: "/live/CAM004", actions: [1] },
  { menuId: "L002", parentId: "LI000", menuName: "Zone 2", icon: "", seq: 2, path: "", actions: [1] },
  { menuId: "CAM001", parentId: "L002", menuName: "Camera 1", icon: "", seq: 1, path: "/live/cam3", actions: [1] },
  { menuId: "CAM002", parentId: "L002", menuName: "Camera 2", icon: "", seq: 2, path: "/live/cam4", actions: [1] },
  { menuId: "CAM003", parentId: "L002", menuName: "Camera 3", icon: "", seq: 2, path: "/live/cam2", actions: [1] },
]

export const getPermissions = async (userid: string) => {
  try {
    const res =  await api.get<any>(`${API_ROUTES.permission.user_permissions}?userid=${userid}`);
    const mapData: UserPermission[] = res?.map((item) => ({
      menuId: item.menuid,
      parentId: item.parentid ?? '',
      menuName: item.menuname,
      icon: item.icon,
      seq: item.seq,
      path: item.path,
      actions: item.actions,
    }));
    return mapData;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};


export const validateLogin = async (username: string, password: string) => {
  try {
    // if (username === "admin" && password === "admin") {
    //   return {
    //     id:"admin",
    //     userid: "TH0001",
    //     fullname: "Administrator",
    //     email: "admin@pi.com",
    //   };
    // }
    const res =  await api.get<any>(`${API_ROUTES.auth.login}?username=${username}&password=${password}`);
    return res;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};
