import { api } from '@/app/utils/api'
import type { UserPermission } from "@/app/types/user-permissions"
import { API_ROUTES } from '@/app/constants/endpoint';
import { extractErrorMessage } from '@/app/utils/errorHandler';

export interface MenuCreateRequest {
  menuId: string;
  parentId: string;
  menuName: string;
  icon: string;
  seq: number;
  path: string;
  actions: number[];
}

export interface MenuUpdateRequest {
  menuName?: string;
  icon?: string;
  seq?: number;
  path?: string;
  actions?: number[];
}

export const search = async () => {
  try {
    console.log('🔍 Calling menu API...');
    const res = await api.post<any>(`${API_ROUTES.menu.get}`);
    console.log('📡 Raw API response:', res);
    
    // Handle different response formats
    let rawData = res?.menus || res?.data || res || [];
    
    // If it's not an array, try to extract from response
    if (!Array.isArray(rawData)) {
      console.log('Response is not array, trying to extract data...');
      rawData = Object.values(rawData).find(value => Array.isArray(value)) || [];
    }
    
    console.log('📋 Raw menu data:', rawData);
    
    const mapData: UserPermission[] = rawData.map((item: any) => {
      // Convert actionid string to actions array
      let actions: number[] = [1]; // Default to View
      
      if (item.actionid) {
        if (typeof item.actionid === 'string') {
          // Convert "1,2,3,4,5,6" to [1,2,3,4,5,6]
          actions = item.actionid.split(',').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id));
        } else if (Array.isArray(item.actionid)) {
          actions = item.actionid;
        }
      } else if (item.actions) {
        actions = Array.isArray(item.actions) ? item.actions : [1];
      }
      
      return {
        menuId: item.menuid || item.menuId,
        parentId: item.parentid || item.parentId || "", // Convert null to ""
        menuName: item.menuname || item.menuName,
        icon: item.icon || "",
        seq: item.seq || 0,
        path: item.path || "",
        actions: actions
      };
    });

    console.log('✅ Mapped menu data:', mapData);
    return mapData;
  } catch (error) {
    console.warn('⚠️ Menu API failed, falling back to mock data:', extractErrorMessage(error));
    // Return mock data as fallback
    return [
      { menuId: "DB000", parentId: "", menuName: "Dashboard", icon: "", seq: 1, path: "/dashboard", actions: [1] },
      { menuId: "LI000", parentId: "", menuName: "Live inspection view", icon: "", seq: 2, path: "", actions: [1] },
      { menuId: "MD000", parentId: "", menuName: "Master data", icon: "", seq: 3, path: "", actions: [1,3] },
      { menuId: "MD001", parentId: "MD000", menuName: "Product", icon: "", seq: 1, path: "/master-data/product", actions: [1, 2, 3, 4, 5, 6] },
      { menuId: "MD002", parentId: "MD000", menuName: "Product Type", icon: "", seq: 2, path: "/master-data/product-type", actions: [1, 2, 3, 4, 5, 6] },
      { menuId: "MD003", parentId: "MD000", menuName: "Defect Type", icon: "", seq: 3, path: "/master-data/defect-type", actions: [1, 2, 3, 4, 5, 6] },
      { menuId: "MD004", parentId: "MD000", menuName: "Camera", icon: "", seq: 4, path: "/master-data/camera", actions: [1, 2, 3, 4, 5, 6] },
      { menuId: "MD005", parentId: "MD000", menuName: "User", icon: "", seq: 5, path: "/master-data/user", actions: [1, 2, 3, 4, 5, 6] },
      { menuId: "MD006", parentId: "MD000", menuName: "Role", icon: "", seq: 6, path: "/master-data/role", actions: [1, 2, 3, 4, 5, 6] },
      { menuId: "RP000", parentId: "", menuName: "Report", icon: "", seq: 4, path: "", actions: [1] },
      { menuId: "RP001", parentId: "RP000", menuName: "Product Defect Result", icon: "", seq: 1, path: "/report/product-defect", actions: [1, 3, 6] },
      { menuId: "RP002", parentId: "RP000", menuName: "Defect Summary", icon: "", seq: 2, path: "/report/defect-summary", actions: [1, 6] },
      { menuId: "RP003", parentId: "RP000", menuName: "Transaction", icon: "", seq: 3, path: "/report/transaction", actions: [1, 6] },
      { menuId: "DM000", parentId: "", menuName: "Detection Model", icon: "", seq: 5, path: "/detection-model", actions: [1, 2, 3, 4, 5, 6] },
      { menuId: "PL000", parentId: "", menuName: "Planning", icon: "", seq: 6, path: "/planning", actions: [1, 2, 3, 4, 5, 6] },
    ];
  }
};

export const create = async (param: MenuCreateRequest) => {
  try {
    const res = await api.post<any>(`${API_ROUTES.menu.insert}`, param);
    return {
      ...param,
      createdDate: new Date(),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const update = async (menuId: string, param: MenuUpdateRequest) => {
  try {
    const res = await api.put<any>(`${API_ROUTES.menu.update}?menuid=${menuId}`, param);
    return {
      ...param,
      updatedDate: new Date(),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};