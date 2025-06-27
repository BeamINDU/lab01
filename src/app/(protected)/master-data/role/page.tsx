'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from 'lucide-react'
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { exportExcel, exportCSV } from "@/app/libs/export";
import { ExportType } from '@/app/constants/export-type';
import { Role, ParamSearch } from "@/app/types/role"
import { search, detail, create, update, remove, upload, saveRolePermissions } from "@/app/libs/services/role"; 
import { usePermission } from '@/app/contexts/permission-context';
import { useSession } from "next-auth/react";
import { Menu, Action } from '@/app/constants/menu';
import { extractErrorMessage } from '@/app/utils/errorHandler';
import { formatDateTime } from "@/app/utils/date";
import UploadButton from "@/app/components/common/UploadButton";
import ExportButton from "@/app/components/common/ExportButton";
import DataTable from "@/app/components/table/DataTable";
import RoleColumns from "./components/role-column";
import RoleFilterForm from './components/role-filter';
import RoleFormModal from "./components/role-form";
import RolePermissionModal from './components/role-permission';

export default function Page() {
  const { data: session } = useSession();
  const { hasPermission } = usePermission();
  const { register, getValues, setValue, reset } = useForm();
  const [data, setData] = useState<Role[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editingData, setEditingData] = useState<Role | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);

  useEffect(() => {
    handleSearch();
  }, []);
  
  const handleSavePermission = async (data: {roleId: number, permissions: {menuId: string, actions: number[]}[]}) => {
    try {
      console.log('Save permission data:', data);
      await saveRolePermissions(data.roleId, data.permissions);
      showSuccess('Permissions saved successfully');
      setIsPermissionModalOpen(false);
    } catch (error) {
      console.error('Failed to save permissions:', error);
      showError('Failed to save permissions');
    }
  };
  const handleSearch = async () => {
    try {
      const formValues = getValues();
      const param: ParamSearch = {
        roleName: formValues.roleName || '',
        status: formValues.status || undefined,
      };
      const roles = await search(param);
      setData(Array.isArray(roles) ? roles : []);
    } catch (error) {
      console.error("Error search role:", error);
      showError('Error search role');
      setData([]);
    }
  };

  const handleExport = (type: ExportType) => {
    try {
      const headers = ["Role Name", "Description", "Status"];
      const keys: (keyof Role)[] = ["roleName", "description", "statusName"];
      const fileName = `Role_${formatDateTime(new Date(), 'yyyyMMdd_HHmmss')}`;
    
      switch (type) {
        case ExportType.CSV:
          exportCSV(data, headers, keys, fileName);
          break;
        case ExportType.Excel:
          exportExcel(data, headers, keys, fileName);
          break;
      }
    } catch (error) {
      console.error("Export operation failed:", error);
      showError(`Export failed: ${extractErrorMessage(error)}`);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      await upload(session?.user?.userid ?? '', file);
      showSuccess(`Uploaded: ${file.name}`);
    } catch (error) {
      console.error("Upload operation failed:", error);
      showError(`Upload failed: ${extractErrorMessage(error)}`);
    }
  };
  
  const handleAddEdit = async (row?: Role) => {
    try {
      if (row) {
        // const result = row.id ? (await detail(row.id)) : (row as Role);
        const result = data.find((item) => item.id === row.id) ?? row;
        setEditingData(result);
      } else {
        reset();
        setEditingData(null);
      }
      setIsFormModalOpen(true);
    } catch (error) {
      console.error('Failed to open modal:', error);
      showError('Failed to load role details');
    }
  };

  const handlePermission = async (row?: Role) => {
    setEditingData(row || null);
    setIsPermissionModalOpen(true);
  };

  const handleDelete = async () => {
    const result = await showConfirm('Are you sure you want to delete these product role?')
    if (result.isConfirmed) {
      try {
        for (const id of selectedIds) {
          await remove(id);
        }
        setData(prev => prev.filter(item => !selectedIds.includes(item.id ?? 0)));
        setSelectedIds([]);
        showSuccess(`Deleted successfully`)
      } catch (error) {
        console.error('Delete operation failed:', error);
        showError(`Delete failed: ${extractErrorMessage(error)}`);
      }
    }
  };

  const handleSave = async (formData: Role) => {
    try {
      if (formData.id === 0) {
        const newData = await create(formData) as Role;
        setData(prev => [...prev, newData]);
      } else {
        const updatedData = await update(formData?.id ?? 0, formData) as Role;
        setData(prev => prev.map(item => (item.id === formData.id ? updatedData : item)));
      }
      showSuccess(`Saved successfully`)
      setIsFormModalOpen(false);
      reset();
    } catch (error) {
      console.error('Save operation failed:', error);
      showError(`Save failed: ${extractErrorMessage(error)}`);
    }
  };
  

  return (
    <>
      <h2 className="text-2xl font-bold mb-2 ml-3">Role</h2>
      <div className="p-4 mx-auto">
      <div className="mb-6 max-w-full text-sm">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Form */}
            <div className="md:basis-[80%]">
              <RoleFilterForm 
                register={register} 
                setValue={setValue}
                onSearch={handleSearch} 
              />
            </div>
            
            <div className="md:basis-[20%] flex flex-col justify-end items-end gap-4">
              <div className="flex flex-wrap justify-end gap-2">
                {/* Upload Button */}
                {hasPermission(Menu.Role, Action.Upload) && (
                  <UploadButton onUpload={handleUpload} />
                )}

                {/* Export Button */}
                {hasPermission(Menu.Role, Action.Export) && (
                  <ExportButton onExport={handleExport} />
                )}
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                {/* Add Button */}
                {hasPermission(Menu.Role, Action.Add) && (
                  <button
                    className="flex items-center gap-1 text-white px-4 py-2 rounded btn-primary"
                    onClick={() => handleAddEdit()}
                  >
                    Add
                    <Plus size={16} className="mt-1" />
                  </button>
                )}
                {/* Delete Button */}
                {hasPermission(Menu.Role, Action.Delete) && (
                  <button
                    className={`flex items-center gap-1 px-4 py-2 rounded ${selectedIds.length === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "btn-danger" }`}
                    disabled={selectedIds.length === 0}
                    onClick={handleDelete}
                  >
                    Delete
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* DataTable */}
        <DataTable
          columns={RoleColumns({
            showCheckbox: hasPermission(Menu.Product, Action.Delete),
            canEdit: hasPermission(Menu.Product, Action.Edit),
            openEditModal:handleAddEdit,
            openPermissionModal:handlePermission,
            selectedIds,
            setSelectedIds,
            data,
          })}
          data={data}
          selectedIds={selectedIds}
          defaultSorting={[{ id: "roleName", desc: false }]}
        />
        {isPermissionModalOpen && (
          <RolePermissionModal
            canEdit={hasPermission(Menu.Role, Action.Edit)}
            showModal={isPermissionModalOpen}
            setShowModal={setIsPermissionModalOpen}
            editingData={editingData}
            onSave={handleSavePermission }
          />
        )}
        {/* Add & Edit Modal */}
        {isFormModalOpen && (
          <RoleFormModal
            canEdit={hasPermission(Menu.Product, Action.Edit)} 
            showModal={isFormModalOpen}
            setShowModal={setIsFormModalOpen}
            editingData={editingData}
            onSave={handleSave}
          />
        )}

      </div>
    </>
  )
}
