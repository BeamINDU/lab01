"use client";

import { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';
import { UserPermission } from "@/app/types/user-permissions";
import { search as searchMenus } from '@/app/libs/services/menu';
import { search as searchPermissions, update as updatePermissions } from '@/app/libs/services/permission';
import { extractErrorMessage } from '@/app/utils/errorHandler';

// Action mappings
const ACTION_LABELS = {
  1: 'View',
  2: 'Add', 
  3: 'Edit',
  4: 'Delete',
  5: 'Upload',
  6: 'Export'
};

// Group type to manage menu groups
type MenuGroup = {
  id: string;
  name: string;
  count: number;
  menus: UserPermission[];
};

interface RolePermissionModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  editingData: { roleName?: string; id?: number } | null;
  onSave?: (formData: {roleId: number, permissions: {menuId: string, actions: number[]}[]}) => void;
  canEdit: boolean;
}

export default function RolePermissionModal({
  showModal,
  setShowModal,
  editingData,
  onSave,
  canEdit
}: RolePermissionModalProps) {
  const [allMenus, setAllMenus] = useState<UserPermission[]>([]);
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<{[key: string]: number[]}>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all menus when component loads
  useEffect(() => {
    if (!showModal) return;

    const fetchMenus = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('🔄 Fetching menus...');
        const menus = await searchMenus();
        setAllMenus(menus);
        
        // Group menus by top-level parents
        const groups: MenuGroup[] = [];
        const topLevelMenus = menus.filter(menu => !menu.parentId || menu.parentId === "");
        
        topLevelMenus.forEach(topMenu => {
          const directChildren = menus.filter(m => m.parentId === topMenu.menuId);
          const childCount = directChildren.length;
          
          groups.push({
            id: topMenu.menuId,
            name: topMenu.menuName,
            count: childCount,
            menus: [topMenu, ...directChildren]
          });
        });
        
        setMenuGroups(groups);
        
        // Select the first group by default
        if (groups.length > 0) {
          setSelectedGroup(groups[0].id);
        }
      } catch (error) {
        console.error("❌ Failed to fetch menus:", error);
        setError(`Failed to load menu data: ${extractErrorMessage(error)}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMenus();
  }, [showModal]);

  // Fetch role permissions when editing data changes
  useEffect(() => {
    if (!showModal || !editingData?.id) return;

    const fetchPermissions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const roleId = editingData.id;
        if (typeof roleId !== 'number') return;
        
        console.log('🔍 Fetching permissions for roleId:', roleId);
        const permissions = await searchPermissions(roleId);
        
        // Convert API response to the format we need for the UI
        const permissionsMap: {[key: string]: number[]} = {};
        permissions.forEach((p: any) => {
          const menuId = p.menuId || p.menuid;
          const actions = p.actions || [1];
          if (menuId) {
            permissionsMap[menuId] = actions;
          }
        });
        
        setSelectedPermissions(permissionsMap);
        console.log('✅ Loaded permissions:', permissionsMap);
      } catch (error) {
        console.error("❌ Failed to fetch permissions:", error);
        setError(`Failed to load permission data: ${extractErrorMessage(error)}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPermissions();
  }, [showModal, editingData]);

  // Handle individual menu action changes (ป้องกันการเลือก action ที่ไม่มีใน database)
  const handleMenuActionChange = (menuId: string, actionId: number, checked: boolean) => {
    const menu = allMenus.find(m => m.menuId === menuId);
    
    // ตรวจสอบว่า action นี้มีใน database หรือไม่
    if (!menu || !menu.actions.includes(actionId)) {
      return; // ไม่ให้เปลี่ยนแปลงถ้า action ไม่มีใน database
    }
    
    setSelectedPermissions(prev => {
      const currentActions = prev[menuId] || [];
      
      if (checked) {
        // Add action if not already present
        if (!currentActions.includes(actionId)) {
          return {
            ...prev,
            [menuId]: [...currentActions, actionId].sort()
          };
        }
      } else {
        // Remove action
        return {
          ...prev,
          [menuId]: currentActions.filter(action => action !== actionId)
        };
      }
      
      return prev;
    });
  };

  // Handle permission checkbox changes (legacy - not used in tree view)
  const handlePermissionChange = (actionId: number, checked: boolean) => {
    if (!selectedGroup) return;

    const groupMenus = menuGroups.find(g => g.id === selectedGroup)?.menus || [];
    
    setSelectedPermissions(prev => {
      const newPermissions = { ...prev };
      
      // Apply to all menus in the selected group
      groupMenus.forEach(menu => {
        const currentActions = newPermissions[menu.menuId] || [];
        
        if (checked) {
          // Add action if menu supports it and not already present
          if (menu.actions.includes(actionId) && !currentActions.includes(actionId)) {
            newPermissions[menu.menuId] = [...currentActions, actionId].sort();
          }
        } else {
          // Remove action
          newPermissions[menu.menuId] = currentActions.filter(action => action !== actionId);
        }
      });
      
      return newPermissions;
    });
  };

  // Handle select all (เฉพาะ child menus เท่านั้น)
  const handleSelectAll = (checked: boolean) => {
    if (!selectedGroup) return;

    const groupMenus = menuGroups.find(g => g.id === selectedGroup)?.menus || [];
    const childMenus = groupMenus.filter(m => m.parentId !== "" && m.parentId);
    
    setSelectedPermissions(prev => {
      const newPermissions = { ...prev };
      
      // ทำงานกับ child menus เท่านั้น
      childMenus.forEach(menu => {
        if (checked) {
          newPermissions[menu.menuId] = [...menu.actions];
        } else {
          newPermissions[menu.menuId] = [];
        }
      });
      
      return newPermissions;
    });
  };

  // Check if action is selected for the current group
  const isActionSelected = (actionId: number): boolean => {
    if (!selectedGroup) return false;
    
    const groupMenus = menuGroups.find(g => g.id === selectedGroup)?.menus || [];
    
    // Check if ANY menu in the group has this action selected
    return groupMenus.some(menu => {
      const menuPermissions = selectedPermissions[menu.menuId] || [];
      return menu.actions.includes(actionId) && menuPermissions.includes(actionId);
    });
  };

  // Check if select all should be checked (เฉพาะ child menus เท่านั้น)
  const isSelectAllChecked = (): boolean => {
    if (!selectedGroup) return false;
    
    const groupMenus = menuGroups.find(g => g.id === selectedGroup)?.menus || [];
    const childMenus = groupMenus.filter(m => m.parentId !== "" && m.parentId);
    
    // เช็คเฉพาะ child menus
    return childMenus.length > 0 && childMenus.every(menu => {
      const menuPermissions = selectedPermissions[menu.menuId] || [];
      return menu.actions.every(action => menuPermissions.includes(action));
    });
  };

  // Handle form submission
  const handleSave = async () => {
    if (!editingData?.id) return;

    try {
      setIsLoading(true);
      
      const roleId = editingData.id;
      if (typeof roleId !== 'number') return;
      
      // Convert selectedPermissions to the format expected by the API
      const permissions = Object.entries(selectedPermissions)
        .filter(([menuId, actions]) => actions.length > 0)
        .map(([menuId, actions]) => ({
          menuId,
          actions
        }));

      const formData = {
        roleId,
        permissions
      };

      console.log('🔄 Submitting permissions:', formData);
      
      // Call API to update permissions
      await updatePermissions(roleId, formData);
      
      // Notify parent component if callback provided
      if (onSave) {
        onSave(formData);
      }
      
      // Close modal
      setShowModal(false);
      
    } catch (error) {
      console.error('❌ Error submitting permissions:', error);
      setError(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Get available actions for the selected group
  const getAvailableActions = (): number[] => {
    if (!selectedGroup) return [];
    
    const groupMenus = menuGroups.find(g => g.id === selectedGroup)?.menus || [];
    const allActions = new Set<number>();
    
    groupMenus.forEach(menu => {
      menu.actions.forEach(action => allActions.add(action));
    });
    
    return Array.from(allActions).sort();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded shadow-lg w-3/4 max-w-5xl relative max-h-[90vh] overflow-hidden">
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 z-10"
          onClick={() => setShowModal(false)}
        >
          <X className="text-red-500" size={20} />
        </button>

        <div className="relative border-b">
          <h2 className="text-xl font-semibold text-center py-4">
            Permission
          </h2>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-6 mt-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="flex h-[450px]">
          {/* Left Sidebar - Permission Groups */}
          <div className="w-2/5 border-r bg-gray-50">
            <div className="p-4">
              <h3 className="font-medium mb-3 text-gray-600">Permission Group</h3>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-sm text-gray-600">Loading...</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {menuGroups.map((group) => (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => setSelectedGroup(group.id)}
                      className={`w-full text-left px-3 py-2 rounded transition-colors ${
                        selectedGroup === group.id 
                          ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {group.name} ({group.count})
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Content - Permission Checkboxes */}
          <div className="flex-1 p-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading permissions...</p>
              </div>
            ) : selectedGroup ? (
              <div className="space-y-3">
                {/* Select All */}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelectAllChecked()}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    disabled={!canEdit}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-900">Select All</span>
                </label>

                {/* Menu Tree Structure */}
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {(() => {
                    const groupMenus = menuGroups.find(g => g.id === selectedGroup)?.menus || [];
                    const childMenus = groupMenus.filter(m => m.parentId !== "" && m.parentId);
                    
                    // แสดงเฉพาะ child menus เท่านั้น
                    return childMenus.map((menu) => (
                      <div key={menu.menuId} className="border-b border-gray-100 pb-3 last:border-b-0">
                        <div className="text-gray-700">
                          <div className="text-sm mb-2 font-medium">{menu.menuName}</div>
                          
                          {/* Actions for this menu */}
                          <div className="grid grid-cols-2 gap-1 ml-4">
                            {[1, 2, 3, 4, 5, 6].map((actionId) => {
                              const isChecked = selectedPermissions[menu.menuId]?.includes(actionId) || false;
                              const isAvailable = menu.actions.includes(actionId);
                              
                              return (
                                <label key={`${menu.menuId}-${actionId}`} className={`flex items-center space-x-2 cursor-pointer py-1 ${
                                  !isAvailable ? 'opacity-50' : ''
                                }`}>
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => handleMenuActionChange(menu.menuId, actionId, e.target.checked)}
                                    disabled={!canEdit || !isAvailable}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className={`text-sm ${isAvailable ? 'text-blue-600' : 'text-gray-400'}`}>
                                    {ACTION_LABELS[actionId as keyof typeof ACTION_LABELS]}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Select a permission group to manage permissions</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
          >
            Cancel
          </button>
          {canEdit && (
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 disabled:bg-gray-400"
            >
              <Save size={16} />
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}