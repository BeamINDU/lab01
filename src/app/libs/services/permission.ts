import { api } from '@/app/utils/api'
import type { UserPermission } from "@/app/types/user-permissions"
import { API_ROUTES } from '@/app/constants/endpoint';
import { extractErrorMessage } from '@/app/utils/errorHandler';

export interface PermissionCreateRequest {
  roleId: number;
  menuId: string;
  actions: number[];
}

export interface UpdatePermissionRequest {
  roleId: number;
  permissions: {
    menuId: string;
    actions: number[];
  }[];
}

// ตาม backend: PUT /permissions?roleid={roleId}
export const search = async (roleId: number) => {
  try {
    console.log('🔍 Fetching permissions for roleId:', roleId);
    
    // ใช้ PUT request กับ query parameter ตาม backend API structure
    const res = await api.put<any>(`${API_ROUTES.permission.get}?roleid=${roleId}`);
    
    console.log('📡 Permission API response:', res);
    
    // Handle different response formats based on backend
    let permissionData: any[] = []; // Explicitly type as any array
    
    if (res?.permissions && Array.isArray(res.permissions)) {
      permissionData = res.permissions;
    } else if (res?.data && Array.isArray(res.data)) {
      permissionData = res.data;
    } else if (Array.isArray(res)) {
      permissionData = res;
    } else {
      console.warn('Unexpected permission response format:', res);
    }
    
    const mapData: UserPermission[] = permissionData.map((item: any) => ({
      menuId: item.menuid || item.menuId,
      parentId: item.parentid || item.parentId || "",
      menuName: item.menuname || item.menuName || "",
      icon: item.icon || "",
      seq: item.seq || 0,
      path: item.path || "",
      actions: Array.isArray(item.actions) ? item.actions : 
               typeof item.actions === 'string' ? item.actions.split(',').map(Number) :
               item.actionid ? (typeof item.actionid === 'string' ? item.actionid.split(',').map(Number) : [item.actionid]) :
               [1] // Default to View permission
    }));

    console.log('✅ Mapped permission data:', mapData);
    return mapData;
    
  } catch (error) {
    console.warn('⚠️ Permission API failed for roleId:', roleId, 'Error:', extractErrorMessage(error));
    // Return empty permissions as fallback
    return [];
  }
};

export const create = async (param: PermissionCreateRequest) => {
  try {
    const res = await api.post<any>(`${API_ROUTES.permission.insert}`, param);
    return {
      ...param,
      createdDate: new Date(),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

// ตาม backend: PUT /update_permission?permissionid=${roleId}
export const update = async (roleId: number, param: UpdatePermissionRequest) => {
  try {
    console.log('🔄 Updating permissions for roleId:', roleId, param);
    
    // ใช้ PUT request ตาม backend API structure
    const res = await api.put<any>(`${API_ROUTES.permission.update}?permissionid=${roleId}`, param);
    
    console.log('✅ Permission update response:', res);
    
    return {
      ...param,
      updatedDate: new Date(),
    };
  } catch (error) {
    console.error('❌ Permission update failed:', extractErrorMessage(error));
    throw new Error(extractErrorMessage(error));
  }
};

export const remove = async (permissionId: number) => {
  try {
    const res = await api.delete<any>(`${API_ROUTES.permission.delete}?permissionid=${permissionId}`);
    return res;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};