import { api } from '@/app/utils/api'
import type { UserPermission } from "@/app/types/user-permissions"
import { extractErrorMessage } from '@/app/utils/errorHandler';
import { search as searchMenus } from './menu';
import { search as searchPermissions, update as updatePermissions } from './permission';


export const getMenus = async (): Promise<UserPermission[]> => {
  try {
    return await searchMenus();
  } catch (error) {
    console.error('Failed to fetch menus:', extractErrorMessage(error));
    throw new Error(`Failed to fetch menu data: ${extractErrorMessage(error)}`);
  }
};

export const getRolePermissions = async (roleId: number): Promise<UserPermission[]> => {
  try {
    return await searchPermissions(roleId);
  } catch (error) {
    console.error('Failed to fetch role permissions:', extractErrorMessage(error));
    throw new Error(`Failed to fetch role permissions: ${extractErrorMessage(error)}`);
  }
};

export const saveRolePermissions = async (roleId: number, permissions: {menuId: string, actions: number[]}[]): Promise<void> => {
  try {
    await updatePermissions(roleId, { roleId, permissions });
  } catch (error) {
    console.error('Failed to save role permissions:', extractErrorMessage(error));
    throw new Error(`Failed to save role permissions: ${extractErrorMessage(error)}`);
  }
};