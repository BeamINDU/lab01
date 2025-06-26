"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';
import { X, Save } from 'lucide-react';
import { UserPermission } from "@/app/types/user-permissions";
import { search as searchMenus } from '@/app/libs/services/menu';
import { search as searchPermissions, update as updatePermissions } from '@/app/libs/services/permission';
import { extractErrorMessage } from '@/app/utils/errorHandler';

const ACTION_LABELS = {
  1: 'View', 2: 'Add', 3: 'Edit', 4: 'Delete', 5: 'Upload', 6: 'Export'
} as const;

const ACTIONS = [1, 2, 3, 4, 5, 6]; // All possible actions (kept for compatibility)

type MenuGroup = {
  id: string;
  name: string;
  count: number;
  menus: UserPermission[];
};

interface RolePermissionModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  editingData: { roleName?: string; id?: number } | null;
  onSave?: (formData: {roleId: number, permissions: {menuId: string, actions: number[]}[]}) => void;
  canEdit: boolean;
}

export default function RolePermissionModal({
  showModal, setShowModal, editingData, onSave, canEdit
}: RolePermissionModalProps) {
  const [allMenus, setAllMenus] = useState<UserPermission[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, number[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized menu groups with selected action counts
  const menuGroups = useMemo(() => {
    console.log('🔄 Computing menu groups...');
    console.log('📊 AllMenus for grouping:', allMenus);
    
    const groups: MenuGroup[] = [];
    const topLevelMenus = allMenus.filter(menu => !menu.parentId);
    
    console.log('📋 Top Level Menus:', topLevelMenus);
    
    topLevelMenus.forEach((topMenu, index) => {
      const children = allMenus.filter(m => m.parentId === topMenu.menuId);
      
      // Calculate selected actions count for this group
      let selectedActionsCount = 0;
      
      if (children.length > 0) {
        // For groups with children, count selected actions in child menus
        children.forEach(child => {
          const childPermissions = selectedPermissions[child.menuId] || [];
          selectedActionsCount += childPermissions.length;
        });
      } else {
        // For groups without children, count selected actions in parent menu
        const parentPermissions = selectedPermissions[topMenu.menuId] || [];
        selectedActionsCount += parentPermissions.length;
      }
      
      console.log(`📁 Group ${index + 1} (${topMenu.menuName}):`, {
        topMenu,
        children,
        childCount: children.length,
        selectedActionsCount
      });
      
      groups.push({
        id: topMenu.menuId,
        name: topMenu.menuName,
        count: selectedActionsCount, // Changed from children.length to selectedActionsCount
        menus: [topMenu, ...children]
      });
    });
    
    console.log('🎯 Final Menu Groups:', groups);
    return groups;
  }, [allMenus, selectedPermissions]); // Added selectedPermissions dependency

  // Get child menus for selected group
  const currentChildMenus = useMemo(() => {
    if (!selectedGroup) {
      console.log('⚠️ No selected group');
      return [];
    }
    
    const group = menuGroups.find(g => g.id === selectedGroup);
    console.log('🎯 Selected Group Details:', group);
    
    const children = group?.menus.filter(m => m.parentId) || [];
    console.log('👥 Child Menus for selected group:', children);
    
    return children;
  }, [selectedGroup, menuGroups]);

  // Check if select all should be checked
  const isSelectAllChecked = useMemo(() => {
    if (!selectedGroup) return false;
    
    const groupMenus = menuGroups.find(g => g.id === selectedGroup)?.menus || [];
    const childMenus = groupMenus.filter(m => m.parentId !== "" && m.parentId);
    const parentMenu = groupMenus.find(m => !m.parentId);
    
    // If no child menus, check parent menu
    if (childMenus.length === 0 && parentMenu) {
      const menuPermissions = selectedPermissions[parentMenu.menuId] || [];
      return parentMenu.actions.every(action => menuPermissions.includes(action));
    }
    
    // Check child menus
    return childMenus.length > 0 && childMenus.every(menu => {
      const menuPermissions = selectedPermissions[menu.menuId] || [];
      return menu.actions.every(action => menuPermissions.includes(action));
    });
  }, [selectedGroup, menuGroups, selectedPermissions]);

  // Handlers
  const handleMenuActionChange = useCallback((menuId: string, actionId: number, checked: boolean) => {
    setSelectedPermissions(prev => ({
      ...prev,
      [menuId]: checked 
        ? [...(prev[menuId] || []), actionId].sort()
        : (prev[menuId] || []).filter(id => id !== actionId)
    }));
  }, []);

  const handleMenuToggle = useCallback((menuId: string, checked: boolean) => {
    // Find the menu to get its available actions
    const menu = allMenus.find(m => m.menuId === menuId);
    const availableActions = menu?.actions || [];
    
    setSelectedPermissions(prev => ({
      ...prev,
      [menuId]: checked ? [...availableActions] : []
    }));
  }, [allMenus]);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (!selectedGroup) return;
    
    const groupMenus = menuGroups.find(g => g.id === selectedGroup)?.menus || [];
    const childMenus = groupMenus.filter(m => m.parentId !== "" && m.parentId);
    const parentMenu = groupMenus.find(m => !m.parentId);
    
    setSelectedPermissions(prev => {
      const newPermissions = { ...prev };
      
      // If no child menus, handle parent menu
      if (childMenus.length === 0 && parentMenu) {
        newPermissions[parentMenu.menuId] = checked ? [...parentMenu.actions] : [];
      } else {
        // Handle child menus
        childMenus.forEach(menu => {
          newPermissions[menu.menuId] = checked ? [...menu.actions] : [];
        });
      }
      
      return newPermissions;
    });
  }, [selectedGroup, menuGroups]);

  const handleSave = useCallback(async () => {
    if (!editingData?.id) return;

    try {
      setIsLoading(true);
      
      console.log('💾 Starting save process...');
      console.log('📋 Current Selected Permissions:', selectedPermissions);
      
      const permissions = Object.entries(selectedPermissions)
        .filter(([menuId, actions]) => {
          const hasActions = actions.length > 0;
          console.log(`📝 Menu ${menuId}: ${JSON.stringify(actions)} - Include: ${hasActions}`);
          return hasActions;
        })
        .map(([menuId, actions]) => ({ menuId, actions }));

      const formData = { roleId: editingData.id, permissions };
      
      console.log('📤 Sending to API:', formData);
      console.log('🎯 Role ID:', editingData.id);
      console.log('📊 Permissions to save:', permissions);
      
      await updatePermissions(editingData.id, formData);
      
      console.log('✅ Save successful');
      onSave?.(formData);
      
    } catch (error) {
      console.error('❌ Save failed:', error);
      console.error('📄 Error Details:', extractErrorMessage(error));
      setError(`Failed to save permissions: ${extractErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
      console.log('🏁 Save process finished');
    }
  }, [editingData?.id, selectedPermissions, onSave]);

  const handleClose = useCallback(() => {
    setShowModal(false);
    setSelectedGroup("");
    setSelectedPermissions({});
    setError(null);
  }, [setShowModal]);

  // Effects
  useEffect(() => {
    if (!showModal) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [menus, permissions] = await Promise.all([
          searchMenus(),
          editingData?.id ? searchPermissions(editingData.id) : Promise.resolve([])
        ]);
        
        setAllMenus(menus);
        
        // Convert permissions to map
        const permissionsMap: Record<string, number[]> = {};
        permissions.forEach((p: any) => {
          const menuId = p.menuId || p.menuid;
          if (menuId) permissionsMap[menuId] = p.actions || [1];
        });
        setSelectedPermissions(permissionsMap);
        
        // Set first group as selected
        const firstGroup = menus.find(m => !m.parentId);
        if (firstGroup) setSelectedGroup(firstGroup.menuId);
        
      } catch (error) {
        setError(`Failed to load data: ${extractErrorMessage(error)}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [showModal, editingData?.id]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Permission - {editingData?.roleName || 'Unknown Role'}
          </h2>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r bg-gray-50 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Permission Group</h3>
            
            {isLoading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
              </div>
            ) : (
              <div className="space-y-1">
                {menuGroups.map(group => (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroup(group.id)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
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

          {/* Content */}
          <div className="flex-1 p-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                <p className="mt-2 text-gray-600">Loading permissions...</p>
              </div>
            ) : selectedGroup ? (
              <div className="flex flex-col h-full space-y-4">
                {/* Select All */}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelectAllChecked}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    disabled={!canEdit}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-black">Select All</span>
                </label>

                {/* Permission Items */}
                <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                  {(() => {
                    const groupMenus = menuGroups.find(g => g.id === selectedGroup)?.menus || [];
                    const childMenus = groupMenus.filter(m => m.parentId !== "" && m.parentId);
                    const parentMenu = groupMenus.find(m => !m.parentId);
                    
                    // If no child menus, show parent menu with its actions
                    if (childMenus.length === 0 && parentMenu) {
                      const menuPermissions = selectedPermissions[parentMenu.menuId] || [];
                      const hasPermissions = menuPermissions.length > 0;
                      
                      return (
                        <div key={parentMenu.menuId} className="space-y-2">
                          {/* Parent Menu Name */}
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={hasPermissions}
                              onChange={(e) => handleMenuToggle(parentMenu.menuId, e.target.checked)}
                              disabled={!canEdit}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="font-medium text-black">{parentMenu.menuName}</span>
                          </div>

                          {/* Parent Menu Actions - show only actions available in database */}
                          <div className="ml-6 space-y-1">
                            {parentMenu.actions.map(actionId => (
                              <label key={actionId} className="flex items-center space-x-2 cursor-pointer text-sm">
                                <input
                                  type="checkbox"
                                  checked={menuPermissions.includes(actionId)}
                                  onChange={(e) => handleMenuActionChange(parentMenu.menuId, actionId, e.target.checked)}
                                  disabled={!canEdit}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-black">
                                  {ACTION_LABELS[actionId as keyof typeof ACTION_LABELS]}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    
                    // Show child menus if available
                    return childMenus.map((menu) => {
                      const menuPermissions = selectedPermissions[menu.menuId] || [];
                      const hasPermissions = menuPermissions.length > 0;
                      
                      return (
                        <div key={menu.menuId} className="space-y-2">
                          {/* Child Menu Name */}
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={hasPermissions}
                              onChange={(e) => handleMenuToggle(menu.menuId, e.target.checked)}
                              disabled={!canEdit}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="font-medium text-black">{menu.menuName}</span>
                          </div>

                          {/* Child Menu Actions - show only actions available in database */}
                          <div className="ml-6 space-y-1">
                            {menu.actions.map(actionId => (
                              <label key={actionId} className="flex items-center space-x-2 cursor-pointer text-sm">
                                <input
                                  type="checkbox"
                                  checked={menuPermissions.includes(actionId)}
                                  onChange={(e) => handleMenuActionChange(menu.menuId, actionId, e.target.checked)}
                                  disabled={!canEdit}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-black">
                                  {ACTION_LABELS[actionId as keyof typeof ACTION_LABELS]}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Select a permission group to view details
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          {canEdit && (
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : 'Save'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}