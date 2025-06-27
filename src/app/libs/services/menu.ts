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

const parseActions = (item: any): number[] => {
  if (item.actionid) {
    if (typeof item.actionid === 'string') {
      return item.actionid.split(',').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id));
    }
    if (Array.isArray(item.actionid)) return item.actionid;
  }
  return Array.isArray(item.actions) ? item.actions : [1];
};

export const search = async () => {
  try {
    const res = await api.get<any>(`${API_ROUTES.menu.get}`);
    let rawData = res?.menus || res?.data || res || [];
    
    if (!Array.isArray(rawData)) {
      rawData = Object.values(rawData).find(value => Array.isArray(value)) || [];
    }
    
    return rawData.map((item: any) => ({
      menuId: item.menuid || item.menuId,
      parentId: item.parentid || item.parentId || "", 
      menuName: item.menuname || item.menuName,
      icon: item.icon || "",
      seq: item.seq || 0,
      path: item.path || "",
      actions: parseActions(item)
    }));
  } catch (error) {
    console.warn('Menu API failed:', extractErrorMessage(error));
    return [];
  }
};