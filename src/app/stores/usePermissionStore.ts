import { create } from 'zustand';
import { getPermissions } from '@/app/libs/services/user-permissions';
import { UserPermission } from '@/app/types/user-permissions';
import { MenuItem } from '@/app/types/menu';
import { Action } from '@/app/constants/menu';

interface PermissionState {
  userPermissions: UserPermission[];
  menuTree: MenuItem[];
  loading: boolean;
  fetchPermissions: (userid: string) => Promise<void>;
  hasPermission: (menuId: string, action: number) => boolean;
}

export const usePermissionStore = create<PermissionState>((set, get) => ({
  userPermissions: [],
  menuTree: [],
  loading: false,
  
  fetchPermissions: async (userid: string) => {
    set({ loading: true });
    try {
      const result = await getPermissions(userid);
      set({
        userPermissions: result,
        menuTree: convertToMenuTree(result),
      });
    } catch (error) {
      console.error('Permission fetch error:', error);
      set({ userPermissions: [], menuTree: [] });
    } finally {
      set({ loading: false });
    }
  },

  hasPermission: (menuId: string, action: number) => {
    const menu = get().userPermissions.find((p) => p.menuId === menuId);
    return menu?.actions.includes(action) ?? false;
  },
}));

const convertToMenuTree = (permissions: UserPermission[]): MenuItem[] => {
  const map = new Map<string, MenuItem>();
  const root: MenuItem[] = [];

  for (const item of permissions) {
    if (!item.actions.includes(Action.View)) continue;

    const menuItem: MenuItem = {
      id: item.menuId,
      label: item.menuName,
      path: item.path || undefined,
      action: item.actions.length > 0 ? item.actions : undefined,
    };

    map.set(item.menuId, menuItem);

    if (item.parentId === "") {
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


// import { usePermissionStore } from "@/app/store/permissionStore";
// const fetchPermissions = usePermissionStore((state) => state.fetchPermissions);
// const loading = usePermissionStore((state) => state.loading);
// useEffect(() => {
//   if (status === "authenticated" && session?.user?.userid) {
//     fetchPermissions(session.user.userid);
//   }
// }, [status, session, fetchPermissions]);

// import { usePermissionStore } from '@/app/store/permissionStore';
// const hasPermission = usePermissionStore((state) => state.hasPermission);

//   if (!hasPermission(menuId, action)) {
//     return <div>คุณไม่มีสิทธิ์ใช้งานส่วนนี้</div>;
//   }