'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from 'lucide-react'
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { toastSuccess, toastError } from '@/app/utils/toast';
import { exportText, exportExcel, exportWord, exportCSV } from "@/app/lib/export";
import { ExportType } from '@/app/lib/constants/export-type';
import { Role, ParamSearch } from "@/app/types/role"
import { search, detail, create, update, remove, upload } from "@/app/lib/services/role";
import { usePermission } from '@/app/contexts/permission-context';
import { Menu, Action } from '@/app/lib/constants/menu';
import UploadButton from "@/app/components/common/UploadButton";
import ExportButton from "@/app/components/common/ExportButton";
import DataTable from "@/app/components/table/DataTable";
import RoleColumns from "./components/role-column";
import RoleFilterForm from './components/role-filter';
import RoleFormModal from "./components/role-form";


export default function Page() {
  const { hasPermission } = usePermission();
  const { register, getValues, setValue, reset } = useForm();
  const [data, setData] = useState<Role[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingData, setEditingData] = useState<Role | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      const formValues = getValues();
      const param: ParamSearch = {
        roleId: formValues.roleId || '',
        roleName: formValues.roleName || '',
        status: formValues.status || '',
      };
      const products = await search(param);
      setData(products);
    } catch (error) {
      console.error("Error search role:", error);
      showError('Error search role');
      setData([]);
    }
  };

  const handleExport = (type: ExportType) => {
    const headers = ["Role ID", "Role Name", "Description", "Status", "Created Date", "Updated Date"];
    const keys: (keyof Role)[] = ["roleId", "roleName", "description", "status", "createdDate", "updatedDate"];
    const fileName = "Product";
  
    switch (type) {
      case ExportType.Text:
        exportText(data, headers, keys, fileName);
        break;
      case ExportType.CSV:
        exportCSV(data, headers, keys, fileName);
        break;
      case ExportType.Excel:
        exportExcel(data, headers, keys, fileName);
        break;
      case ExportType.Word:
        exportWord(data, headers, keys, fileName);
        break;
    }
  };

  const handleUpload = async (file: File) => {
    try {
      await upload(file);
      showSuccess(`Uploaded: ${file.name}`);
    } catch (error) {
      console.error("Upload operation failed:", error);
      showError("Upload failed");
      throw error;
    }
  };
  
  const handleAddEdit = async (row?: Role) => {
    try {
      if (row) {
        const result = await detail(row.roleId ?? "") as Role;
        const updatedRow = { ...result, isCreateMode: !row.roleId };
        setEditingData(updatedRow);
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

  const handleDelete = async () => {
    const result = await showConfirm('Are you sure you want to delete these product role?')
    if (result.isConfirmed) {
      try {
        for (const roleId of selectedIds) {
          await remove(roleId);
        }
        setData(prev => prev.filter(item => !selectedIds.includes(item.roleId ?? "")));
        setSelectedIds([]);
        toastSuccess(`Deleted successfully`);
        showSuccess(`Deleted successfully`)
      } catch (error) {
        console.error('Delete operation failed:', error);
        showError('Delete failed')
      }
    }
  };

  const handleSave = async (formData: Role) => {
    try {
      if (formData.isCreateMode) {
        const newData = await create(formData) as Role;
        setData(prev => [...prev, newData]);
      } else {
        const updatedData = await update(formData) as Role;
        setData(prev => prev.map(item => (item.roleId === formData.roleId ? updatedData : item)));
      }
      toastSuccess(`Saved successfully`);
      showSuccess(`Saved successfully`)
    } catch (error) {
      console.error('Save operation failed:', error);
      showError('Save failed')
    } finally {
      reset();
      setIsFormModalOpen(false);
    }
  };
  
  const handlePermission = async (row?: Role) => {

  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-2 ml-3">Role</h2>
      <div className="p-4 mx-auto">
      <div className="mb-6 max-w-full text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Filters Form */}
            <RoleFilterForm 
              register={register} 
              onSearch={handleSearch} 
            />
            
            <div className="md:col-span-1 flex flex-col justify-between gap-4">
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
          defaultSorting={[{ id: "roleId", desc: false }]}
        />

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
