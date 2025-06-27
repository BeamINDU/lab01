'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { getPermissions } from "@/app/libs/services/user-permissions"
import { UserPermission } from "@/app/types/user-permissions"
import { MenuItem } from "@/app/types/menu";
import { Action } from "@/app/constants/menu";

interface PermissionContextType {
  userPermissions: UserPermission[];
  menuTree: MenuItem[];
  hasPermission: (menuId: string, action: number) => boolean;
  loading: boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [menuTree, setMenuTree] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchPermissions = async () => {
      try {
        const userid = session?.user?.userid;
        console.log("Fetched userid: ", userid);
        if (!userid) return;

        const result = await getPermissions(userid);
        setUserPermissions(result);
        setMenuTree(convertToMenuTree(result));
      } catch (error) {
        console.error('Permission fetch error:', error);
        setUserPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [session, status]);

  const hasPermission = (menuId: string, action: number) => {
    const menu = userPermissions.find((p) => p.menuId === menuId);
    return menu?.actions.includes(action) ?? false;
  };

  const convertToMenuTree = (permissions: UserPermission[]): MenuItem[] => {
    const map = new Map<string, MenuItem>();
    const root: MenuItem[] = [];

    for (const item of permissions) {
      const actions = item.actions.map(Number);
      if (!actions.includes(Action.View)) continue;

      const menuItem: MenuItem = {
        id: item.menuId,
        label: item.menuName,
        icon: item.icon,
        path: item.path || undefined,
        action: item.actions // actions.length > 0 ? actions : undefined,
      };

      map.set(item.menuId, menuItem);

      if (!item.parentId) {
        root.push(menuItem);
      } else {
        const parent = map.get(item.parentId);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(menuItem);
        }
      }
    }
    return root;
  };

  return (
    <PermissionContext.Provider value={{ userPermissions, hasPermission, menuTree, loading }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
};
