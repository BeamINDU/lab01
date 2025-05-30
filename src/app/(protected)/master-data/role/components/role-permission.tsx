"use client";

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { Role } from "@/app/types/role";
import { UserPermission } from "@/app/types/user-permissions";
import { Menu, Action } from '@/app/constants/menu';
import { getAllMenus, getRolePermissions, saveRolePermissions } from "@/app/libs/services/role-permission";

// Schema for the form
const RolePermissionSchema = z.object({
  roleId: z.string().min(1, "Role ID is required"),
  permissions: z.array(
    z.object({
      menuId: z.string(),
      actions: z.array(z.number())
    })
  )
});

type RolePermissionFormValues = z.infer<typeof RolePermissionSchema>;

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
  editingData: Role | null;
  onSave: (formData: {roleId: string, permissions: {menuId: string, actions: number[]}[]}) => void;
  canEdit: boolean;
}

export default function RolePermissionModal({
  showModal,
  setShowModal,
  editingData,
  onSave,
  canEdit
}: RolePermissionModalProps) {
  const { data: session } = useSession();
  const [allMenus, setAllMenus] = useState<UserPermission[]>([]);
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<{[key: string]: number[]}>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RolePermissionFormValues>({
    resolver: zodResolver(RolePermissionSchema),
    defaultValues: {
      roleId: '',
      permissions: []
    }
  });

  // Fetch all menus when component loads
  useEffect(() => {
    const fetchMenus = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const menus = await getAllMenus();
        setAllMenus(menus);
        
        // Group menus
        const groups: MenuGroup[] = [];
        
        // Process top-level menus as groups
        const topLevelMenus = menus.filter(menu => menu.parentId === "");
        
        topLevelMenus.forEach(topMenu => {
          // Count all children
          const countChildren = (parentId: string): number => {
            const directChildren = menus.filter(m => m.parentId === parentId);
            return directChildren.length + directChildren.reduce((sum, child) => sum + countChildren(child.menuId), 0);
          };
          
          const childCount = countChildren(topMenu.menuId);
          
          groups.push({
            id: topMenu.menuId,
            name: topMenu.menuName,
            count: childCount,
            menus: [topMenu, ...menus.filter(m => m.parentId === topMenu.menuId || 
                                             menus.find(subMenu => subMenu.parentId === topMenu.menuId && 
                                                        subMenu.menuId === m.parentId))]
          });
        });
        
        setMenuGroups(groups);
        
        // Select the first group by default
        if (groups.length > 0) {
          setSelectedGroup(groups[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch menus:", error);
        setError("Failed to load menu data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMenus();
  }, []);

  // Fetch role permissions when editing data changes
  useEffect(() => {
    const fetchPermissions = async () => {
      if (!editingData?.roleId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Get permissions for this role from API
        const permissions = await getRolePermissions(editingData.roleId);
        
        // Reset form with the role ID
        reset({
          roleId: editingData.roleId,
          permissions: []
        });
        
        // Convert API response to the format we need for the UI
        const permissionsMap: {[key: string]: number[]} = {};
        permissions.forEach(p => {
          permissionsMap[p.menuId] = p.actions;
        });
        
        setSelectedPermissions(permissionsMap);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
        setError("Failed to load permission data for this role. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPermissions();
  }, [editingData, reset]);

  if (!showModal) return null;

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroup(groupId);
  };

  const handleActionChange = (menuId: string, action: number, checked: boolean) => {
    setSelectedPermissions(prev => {
      const currentActions = prev[menuId] || [];
      
      if (checked) {
        if (action !== Action.View) {
          return {
            ...prev,
            [menuId]: [...new Set([...currentActions, action])]
          };
        }
        return {
          ...prev,
          [menuId]: [...new Set([...currentActions, action])]
        };
      } else {
        return {
          ...prev,
          [menuId]: currentActions.filter(a => a !== action)
        };
      }
    });
  };

  // Select all 
  const handleSelectAll = (checked: boolean) => {
    const newPermissions = {...selectedPermissions};

    if (selectedGroup === "MD000") { // Master Data
      // Get all Master Data menus
      const masterDataMenus = allMenus.filter(menu => 
        menu.menuId === "MD000" || menu.parentId === "MD000"
      );
      
      masterDataMenus.forEach(menu => {
        if (checked) {
          newPermissions[menu.menuId] = [1, 2, 3, 4, 5, 6]; 
        } else {
          newPermissions[menu.menuId] = [];
        }
      });
    } 
    else if (selectedGroup === "RP000") { // Report
      const reportMenus = allMenus.filter(menu => 
        menu.menuId === "RP000" || menu.parentId === "RP000"
      );
    
      reportMenus.forEach(menu => {
        if (checked) {
          newPermissions[menu.menuId] = [1, 6]; 
        } else {
          newPermissions[menu.menuId] = [];
        }
      });
    }
    else if (selectedGroup === "DM000") { 
      if (checked) {
        newPermissions[selectedGroup] = [2, 3, 4]; 
      } else {
        newPermissions[selectedGroup] = [];
      }
    }
    else { 
      if (checked) {
        newPermissions[selectedGroup] = [1]; 
      } else {
        newPermissions[selectedGroup] = [];
      }
    }

    setSelectedPermissions(newPermissions);
  };

  // Helper function to get all menus in a group, including nested ones
  const getAllMenusInGroup = (groupId: string): string[] => {
    const result: string[] = [groupId];
    
    const addChildren = (parentId: string) => {
      const children = allMenus.filter(m => m.parentId === parentId);
      children.forEach(child => {
        result.push(child.menuId);
        addChildren(child.menuId);
      });
    };
    
    addChildren(groupId);
    return result;
  };

  const onSubmit: SubmitHandler<RolePermissionFormValues> = async () => {
    if (!editingData?.roleId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const permissions = Object.entries(selectedPermissions)
        .filter(([_, actions]) => actions.length > 0)
        .map(([menuId, actions]) => ({
          menuId,
          actions
        }));
      
      const formData = {
        roleId: editingData.roleId,
        permissions
      };
      
      // Send data to the API
      await saveRolePermissions(editingData.roleId, permissions);
      
      // Notify parent component
      onSave(formData);
      
      // Close modal
      setShowModal(false);
    } catch (error) {
      console.error("Failed to save permissions:", error);
      setError("Failed to save permissions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to check if all actions are selected for the current group or menu
  const isAllSelected = (menuId: string): boolean => {
    // Define which actions should be "all" for this menu
    let allActions: number[] = [];
    
    if (menuId === "MD000" || menuId.startsWith("MD")) {
      // Master Data - all 6 actions
      allActions = [1, 2, 3, 4, 5, 6];
    } 
    else if (menuId === "RP000" || menuId.startsWith("RP")) {
      // Reports - View and Export
      allActions = [1, 6];
    }
    else if (menuId === "DM000") {
      // Detection Model - Add, Edit, Delete
      allActions = [2, 3, 4];
    }
    else {
      // Others - just View
      allActions = [1];
    }
    
    const menuActions = selectedPermissions[menuId] || [];
    return allActions.every(action => menuActions.includes(action));
  };

  // Check if all actions for all menus in the group are selected
  const areAllActionsSelected = (): boolean => {
    if (selectedGroup === "MD000") {
      // Check all Master Data menus
      const masterDataMenus = allMenus.filter(menu => 
        menu.menuId === "MD000" || menu.parentId === "MD000"
      );
      return masterDataMenus.every(menu => isAllSelected(menu.menuId));
    } 
    else if (selectedGroup === "RP000") {
      // Check all Report menus
      const reportMenus = allMenus.filter(menu => 
        menu.menuId === "RP000" || menu.parentId === "RP000"
      );
      return reportMenus.every(menu => isAllSelected(menu.menuId));
    } 
    else {
      // For simple groups, just check the main menu
      return isAllSelected(selectedGroup);
    }
  };

  // Helper function to get action name
  const getActionName = (action: number): string => {
    switch (action) {
      case Action.View: return "View";
      case Action.Add: return "Add";
      case Action.Edit: return "Edit";
      case Action.Delete: return "Delete";
      case Action.Upload: return "Upload";
      case Action.Export: return "Export";
      default: return `Action ${action}`;
    }
  };

  // Render permissions panel based on selected group
  const renderPermissionsPanel = () => {
    // Loading state
    if (isLoading) {
      return (
        <div className="flex-1 p-4 h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
            <p>Loading permissions...</p>
          </div>
        </div>
      );
    }
    
    // Error state
    if (error) {
      return (
        <div className="flex-1 p-4 h-[400px] flex items-center justify-center">
          <div className="text-center text-red-500">
            <p>{error}</p>
            <button 
              className="mt-2 px-4 py-1 bg-blue-500 text-white rounded"
              onClick={() => setError(null)}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
    
    // Get the current group
    const currentGroup = menuGroups.find(g => g.id === selectedGroup);
    if (!currentGroup) return null;

    // Determine how to render based on the group type
    if (selectedGroup === "DB000" || selectedGroup === "LI000") {
      return (
        <div className="flex-1 p-4 h-[400px] overflow-y-auto">
          <div className="mb-4">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={areAllActionsSelected()}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <span className="font-medium">Select All</span>
            </label>
          </div>
          
          <div className="space-y-3 pl-6">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={selectedPermissions[selectedGroup]?.includes(Action.View) || false}
                onChange={(e) => handleActionChange(selectedGroup, Action.View, e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <span>View</span>
            </label>
          </div>
        </div>
      );
    }
    else if (selectedGroup === "RP000") {
      const reportMenus = allMenus.filter(menu => menu.parentId === "RP000");
      
      return (
        <div className="flex-1 p-4 h-[400px] overflow-y-auto">
          <div className="mb-4">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={areAllActionsSelected()}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <span className="font-medium">Select All</span>
            </label>
          </div>
          
          <div className="space-y-6">
            {reportMenus.map(menu => (
              <div key={menu.menuId} className="pl-4">
                <label className="flex items-center text-sm font-medium mb-2">
                  <input
                    type="checkbox"
                    checked={isAllSelected(menu.menuId)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleActionChange(menu.menuId, Action.View, true);
                        handleActionChange(menu.menuId, Action.Export, true);
                      } else {
                        handleActionChange(menu.menuId, Action.View, false);
                        handleActionChange(menu.menuId, Action.Export, false);
                      }
                    }}
                    className="mr-2 h-4 w-4"
                  />
                  <span>{menu.menuName}</span>
                </label>
                
                <div className="space-y-1 pl-6">
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={selectedPermissions[menu.menuId]?.includes(Action.View) || false}
                      onChange={(e) => handleActionChange(menu.menuId, Action.View, e.target.checked)}
                      className="mr-2 h-4 w-4"
                    />
                    <span>View</span>
                  </label>
                  
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={selectedPermissions[menu.menuId]?.includes(Action.Export) || false}
                      onChange={(e) => handleActionChange(menu.menuId, Action.Export, e.target.checked)}
                      className="mr-2 h-4 w-4"
                    />
                    <span>Export</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    else if (selectedGroup === "MD000") {
      // Master Data shows sub-menus with all permissions
      const masterDataMenus = allMenus.filter(menu => menu.parentId === "MD000");
      
      return (
        <div className="flex-1 p-4 h-[400px] overflow-y-auto">
          <div className="mb-4">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={areAllActionsSelected()}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <span className="font-medium">Select All</span>
            </label>
          </div>
          
          <div className="space-y-6">
            {masterDataMenus.map(menu => (
              <div key={menu.menuId} className="pl-4">
                <label className="flex items-center text-sm font-medium mb-2">
                  <input
                    type="checkbox"
                    checked={isAllSelected(menu.menuId)}
                    onChange={(e) => {
                      const allActions = [1, 2, 3, 4, 5, 6]; 
                      allActions.forEach(action => {
                        handleActionChange(menu.menuId, action, e.target.checked);
                      });
                    }}
                    className="mr-2 h-4 w-4"
                  />
                  <span>{menu.menuName}</span>
                </label>
                
                <div className="space-y-1 pl-6">
                  {[Action.View, Action.Add, Action.Edit, Action.Delete, Action.Upload, Action.Export].map(action => (
                    <label key={`${menu.menuId}-${action}`} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={selectedPermissions[menu.menuId]?.includes(action) || false}
                        onChange={(e) => handleActionChange(menu.menuId, action, e.target.checked)}
                        className="mr-2 h-4 w-4"
                      />
                      <span>{getActionName(action)}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    else if (selectedGroup === "DM000") {
      // Detection Model just shows Add, Edit, Delete permissions
      return (
        <div className="flex-1 p-4 h-[400px] overflow-y-auto">
          <div className="mb-4">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={areAllActionsSelected()}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <span className="font-medium">Select All</span>
            </label>
          </div>
          
          <div className="space-y-3 pl-6">
            {[Action.Add, Action.Edit, Action.Delete].map(action => (
              <label key={`${selectedGroup}-${action}`} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={selectedPermissions[selectedGroup]?.includes(action) || false}
                  onChange={(e) => handleActionChange(selectedGroup, action, e.target.checked)}
                  className="mr-2 h-4 w-4"
                />
                <span>{getActionName(action)}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }
    else {
      // Default case
      return (
        <div className="flex-1 p-4 h-[400px] overflow-y-auto">
          <div className="mb-4">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={areAllActionsSelected()}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <span className="font-medium">Select All</span>
            </label>
          </div>
          
          <div className="space-y-3 pl-6">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={selectedPermissions[selectedGroup]?.includes(Action.View) || false}
                onChange={(e) => handleActionChange(selectedGroup, Action.View, e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <span>View</span>
            </label>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3 relative ">
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 "
          onClick={() => setShowModal(false)}
        >
          <X className="text-red-500" size={20} />
        </button>

        <div className="relative border-b">
          <h2 className="text-2xl font-semibold text-center mb-4">
            {editingData && !editingData.isCreateMode ? 'Edit Permission' : 'Add Permission'}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='text-sm'>
          <input type="hidden" {...register('roleId')} value={editingData?.roleId || ''} />
          
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="flex border-b">
            {/* Left panel - Permission Groups */}
            <div className="w-[200px] border-r p-3 h-[400px] overflow-y-auto">
              <h3 className="text-sm font-medium mb-2">Permission Group</h3>
              
              <div className="space-y-2">
                {menuGroups.map(group => {
                  // จำนวนสิทธิ์ที่ถูกเลือกสำหรับเมนูนี้และเมนูย่อย
                  const groupMenuIds = getAllMenusInGroup(group.id);
                  console.log("Selected permissions for " + group.name + ":", 
                    Object.entries(selectedPermissions)
                      .filter(([key]) => groupMenuIds.includes(key))
                      .map(([key, value]) => ({ menuId: key, actions: value }))
                  );
                  const selectedCount = groupMenuIds.reduce((count, menuId) => {
                    const permissions = selectedPermissions[menuId] || [];
                    return count + permissions.length;
                  }, 0);
                  
                  return (
                    <button
                      key={group.id}
                      type="button"
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        selectedGroup === group.id 
                          ? 'bg-violet-500 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => handleGroupSelect(group.id)}
                    >
                      {group.name} ({selectedCount})
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Right panel - Permissions */}
            {renderPermissionsPanel()}
          </div>
          
          {/* Footer with buttons */}
          <div className="flex justify-end gap-2 mt-4">
            {canEdit && (
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 btn-primary-dark rounded flex items-center gap-2 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Saving...' : 'Save'}
                {!isLoading && <Save size={16} />}
              </button>
            )}
            <button
              type="button"
              className="px-4 py-2 bg-secondary rounded flex items-center gap-2"
              onClick={() => setShowModal(false)}
              disabled={isLoading}
            >
              Cancel
              <X size={16} />
            </button> 
          </div>
        </form>
      </div>
    </div>
  );
}