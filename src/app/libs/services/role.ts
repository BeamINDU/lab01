import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import { Role, ParamSearch } from "@/app/types/role"
import { SelectOption } from "@/app/types/select-option";
import { extractErrorMessage } from '@/app/utils/errorHandler';
import type { UserPermission } from "@/app/types/user-permissions"

export interface UpdatePermissionRequest {
  roleId: number;
  permissions: { menuId: string; actions: number[]; }[];
}

export const search = async (param?: ParamSearch) => { 
  try {
    const queryString = param ? `?${new URLSearchParams(param as any).toString()}` : '';
    const res = await api.get<any>(`${API_ROUTES.role.get}${queryString}`);
    return res?.roles?.map((item: any) => ({
      id: item.roleid,
      roleName: item.rolename,
      description: item.roledescription,
      status: item.rolestatus,
      statusName: item.rolestatus ? 'Active' : 'Inactive',
      createdDate: item.createddate,
      createdBy: item.createdby,
      updatedDate: item.updateddate,
      updatedBy: item.updatedby,
    }));
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const detail = async (id: number) => {
  try {
    return await api.get<Role>(`${API_ROUTES.role.detail}/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const create = async (param: Partial<Role>) => {
  try {
    const res = await api.post<any>(`${API_ROUTES.role.insert}`, param);
    return {
      ...param,
      id: res.roleid,
      statusName: param.status ? 'Active' : 'Inactive',
      createdDate: new Date(res.createddate),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const update = async (id: number, param: Partial<Role>) => {
  try {
    const res = await api.put<any>(`${API_ROUTES.role.update}?roleid=${id}`, param);
    return {
      ...param,
      statusName: param.status ? 'Active' : 'Inactive',
      updatedDate: new Date(res.updateddate),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const remove = async (id: number) => {
  try {
    return await api.delete<Role>(`${API_ROUTES.role.delete}?roleid=${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const upload = async (uploadby: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append('uploadby', uploadby);
    formData.append('file', file);
    return await api.upload<Role[]>(`${API_ROUTES.role.upload}`, formData);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const getRoleOptions = async (param?: ParamSearch) => { 
  try {
    const queryString = param ? `?${new URLSearchParams(param as any).toString()}` : '';
    const res = await api.get<any>(`${API_ROUTES.role.get}${queryString}`);
    return (res?.roles ?? [])
      .filter((item: any) => item.rolestatus)
      .map((item: any) => ({ label: item.rolename, value: item.roleid }));
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const getRoleNameOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.role.suggest_role_name}?q=${q}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

const mapPermissionData = (data: any[]): UserPermission[] => 
  data.map((item: any) => ({
    menuId: item.menuid || item.menuId,
    parentId: item.parentid || item.parentId || "",
    menuName: item.menuname || item.menuName || "",
    icon: item.icon || "",
    seq: item.seq || 0,
    path: item.path || "",
    actions: Array.isArray(item.actions) ? item.actions : 
             typeof item.actions === 'string' ? item.actions.split(',').map(Number) :
             item.actionid ? (typeof item.actionid === 'string' ? item.actionid.split(',').map(Number) : [item.actionid]) :
             [1]
  }));

export const searchPermissions = async (roleId: number) => {
  try {
    const res = await api.put<any>(`${API_ROUTES.role.permissions_get}?roleid=${roleId}`);
    const permissionData = res?.permissions || res?.data || (Array.isArray(res) ? res : []);
    return mapPermissionData(permissionData);
  } catch (error) {
    console.warn('Permission API failed for roleId:', roleId, 'Error:', extractErrorMessage(error));
    return [];
  }
};

export const updatePermissions = async (roleId: number, param: UpdatePermissionRequest) => {
  try {
    await api.put<any>(`${API_ROUTES.role.permissions_update}?roleid=${roleId}`, param);
    return { ...param, updatedDate: new Date() };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getRolePermissions = async (roleId: number): Promise<UserPermission[]> => {
  try {
    const res = await api.put<any>(`${API_ROUTES.role.permissions_get}?roleid=${roleId}`);
    const permissionData = res?.permissions || res?.data || (Array.isArray(res) ? res : []);
    return mapPermissionData(permissionData);
  } catch (error) {
    throw new Error(`Failed to fetch role permissions: ${extractErrorMessage(error)}`);
  }
};

export const saveRolePermissions = async (roleId: number, permissions: {menuId: string, actions: number[]}[]): Promise<void> => {
  try {
    await api.put<any>(`${API_ROUTES.role.permissions_update}?roleid=${roleId}`, { roleId, permissions });
  } catch (error) {
    throw new Error(`Failed to save role permissions: ${extractErrorMessage(error)}`);
  }
};