"use client";

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { X, Save, Check } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { Role } from "@/app/types/role";
import { UserPermission } from "@/app/types/user-permissions";
import { Menu, Action } from '@/app/lib/constants/menu';
import { getAllMenus } from "@/app/lib/services/role-permission";

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
      try {
        const menus = await getAllMenus();
        setAllMenus(menus);
        
        // Group menus
        const groups: MenuGroup[] = [];
        
        // Process top-level menus as groups
        const topLevelMenus = menus.filter(menu => menu.parentId === "");
        
        topLevelMenus.forEach(topMenu => {
          // Count all children (including nested)
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
      }
    };
    
    fetchMenus();
  }, []);


  useEffect(() => {
    if (editingData) {
      reset({
        roleId: editingData.roleId,
        permissions: []
      });
      
      const mockPermissions: {[key: string]: number[]} = {};
      
      setSelectedPermissions(mockPermissions);
    }
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
    const permissions = Object.entries(selectedPermissions)
      .filter(([_, actions]) => actions.length > 0)
      .map(([menuId, actions]) => ({
        menuId,
        actions
      }));
    
    const formData = {
      roleId: editingData?.roleId || '',
      permissions
    };
    
    onSave(formData);
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
          
          <div className="flex border-b">
            {/* Left panel - Permission Groups */}
            <div className="w-[200px] border-r p-3 h-[400px] overflow-y-auto">
              <h3 className="text-sm font-medium mb-2">Permission Group</h3>
              
              <div className="space-y-2">
                {menuGroups.map(group => (
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
                    {group.name} ({group.count + 1})
                  </button>
                ))}
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
                className="px-4 py-2 btn-primary-dark rounded flex items-center gap-2">
                Save
                <Save size={16} />
              </button>
            )}
            <button
              type="button"
              className="px-4 py-2 bg-secondary rounded flex items-center gap-2"
              onClick={() => setShowModal(false)}
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