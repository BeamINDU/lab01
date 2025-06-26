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
    console.log('Calling menu API...');
    const res = await api.post<any>(`${API_ROUTES.menu.get}`);
    console.log(' Raw API response:', res);
    

    let rawData = res?.menus || res?.data || res || [];
    
    if (!Array.isArray(rawData)) {
      console.log('Response is not array, trying to extract data...');
      rawData = Object.values(rawData).find(value => Array.isArray(value)) || [];
    }
    
    console.log('Raw menu data:', rawData);
    
    const mapData: UserPermission[] = rawData.map((item: any) => {
      let actions: number[] = [1]; 
      
      if (item.actionid) {
        if (typeof item.actionid === 'string') {

          actions = item.actionid.split(',').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id));
        } else if (Array.isArray(item.actionid)) {
          actions = item.actionid;
        }
      } else if (item.actions) {
        actions = Array.isArray(item.actions) ? item.actions : [1];
      }
      
      return {
        menuId: item.menuid || item.menuId,
        parentId: item.parentid || item.parentId || "", 
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
    console.warn(' Menu API failed, falling back to mock data:', extractErrorMessage(error));
    // Return mock data as fallback
    return [
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