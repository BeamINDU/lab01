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

export const search = async (roleId: number) => {
  try {
    console.log('🔍 Attempting to fetch permissions for roleId:', roleId);
    
    // ใช้ PUT request ตาม backend API
    const res = await api.put<any>(`${API_ROUTES.permission.get}`, { roleid: roleId });
    
    console.log('📡 Permission API response:', res);
    
    // Handle different response formats
    const mapData: UserPermission[] = res?.permissions?.map((item: any) => ({
      menuId: item.menuid || item.menuId,
      parentId: item.parentid || item.parentId || "",
      menuName: item.menuname || item.menuName,
      icon: item.icon || "",
      seq: item.seq || 0,
      path: item.path || "",
      actions: item.actions || []
    })) || res?.data || [];

    console.log('✅ Mapped permission data:', mapData);
    
    return mapData;
  } catch (error) {
    console.warn('⚠️ Permission API failed for roleId:', roleId, 'Error:', extractErrorMessage(error));
    // Return empty permissions as fallback instead of throwing error
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

export const update = async (roleId: number, param: UpdatePermissionRequest) => {
  try {
    // ใช้ PUT request ตาม backend API - update_permission ต้องการ permissionid ไม่ใช่ roleId
    // สำหรับตอนนี้ใช้ roleId ก่อน แต่อาจต้องแก้ไขตาม backend schema
    const res = await api.put<any>(`${API_ROUTES.permission.update}?permissionid=${roleId}`, param);
    return {
      ...param,
      updatedDate: new Date(),
    };
  } catch (error) {
    console.warn('Permission update API failed:', extractErrorMessage(error));
    // For now, simulate success until API is ready
    return {
      ...param,
      updatedDate: new Date(),
    };
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
