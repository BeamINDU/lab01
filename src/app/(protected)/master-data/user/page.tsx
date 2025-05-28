// src/app/(protected)/master-data/user/page.tsx
'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from 'lucide-react'
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { exportText, exportExcel, exportWord, exportCSV } from "@/app/lib/export";
import { ExportType } from '@/app/lib/constants/export-type';
import { User, ParamSearch } from "@/app/types/user"
import { search, detail, create, update, remove, upload } from "@/app/lib/services/user";
import { usePermission } from '@/app/contexts/permission-context';
import { Menu, Action } from '@/app/lib/constants/menu';
import UploadButton from "@/app/components/common/UploadButton";
import ExportButton from "@/app/components/common/ExportButton";
import DataTable from "@/app/components/table/DataTable";
import UserColumns from "./components/user-column";
import UserFilterForm from './components/user-filter';
import UserFormModal from "./components/user-form";

export default function Page() {
  const { hasPermission } = usePermission();
  const { register, getValues, setValue, reset, watch } = useForm(); 
  const [data, setData] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingData, setEditingData] = useState<User | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Watch สำหรับ roleName เพื่อ debug
  const watchedRoleName = watch("roleName");

  useEffect(() => {
    handleSearch();
  }, []);

  // Debug: แสดงค่าที่ถูก watch
  useEffect(() => {
    console.log('Current roleName value:', watchedRoleName);
  }, [watchedRoleName]);

  const handleSearch = async () => {
    try {
      const formValues = getValues();
      console.log('User search with values:', formValues); 
      
      const param: ParamSearch = {
        userId: formValues.userId || '',
        userName: formValues.userName || '',
        firstname: formValues.firstname || '',
        lastname: formValues.lastname || '',
        roleName: formValues.roleName || '', 
        status: formValues.status !== undefined ? formValues.status : undefined,
      };
      
      console.log('User search parameters:', param); 
      
      const users = await search(param);
      setData(users);
      
      console.log('User search results:', users.length, 'items'); 
    } catch (error) {
      console.error("Error search user:", error);
      showError('Error search user');
      setData([]);
    }
  };

  const handleExport = (type: ExportType) => {
    const headers = ["User ID", "User Name", "First Name","Last Name","Email", "Role Name", "Status", "Created Date", "Updated Date"];
    const keys: (keyof User)[] = ["userId", "userName", "firstname", "lastname", "email", "roleName", "status", "createdDate", "updatedDate"];
    const fileName = "User";
  
    switch (type) {
      case ExportType.CSV:
        exportCSV(data, headers, keys, fileName);
        break;
      case ExportType.Excel:
        exportExcel(data, headers, keys, fileName);
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
  
  const handleAddEdit = async (row?: User) => {
    try {
      if (row) {
        const result = (await detail(row.userId ?? "")) ?? (row as User);
        const updatedRow = { ...result, isCreateMode: !row.userId };
        setEditingData(updatedRow);
      } else {
        reset();
        setEditingData(null);
      }
      setIsFormModalOpen(true);
    } catch (error) {
      console.error('Failed to open modal:', error);
      showError('Failed to load user details');
    }
  };

  const handleDelete = async () => {
    const result = await showConfirm('Are you sure you want to delete these users?')
    if (result.isConfirmed) {
      try {
        for (const userId of selectedIds) {
          await remove(userId);
        }
        setData(prev => prev.filter(item => !selectedIds.includes(item.userId ?? "")));
        setSelectedIds([]);
        showSuccess(`Deleted successfully`)
      } catch (error) {
        console.error('Delete operation failed:', error);
        showError('Delete failed')
      }
    }
  };

  const handleSave = async (formData: User) => {
    try {
      if (formData.isCreateMode) {
        const newData = await create(formData) as User;
        setData(prev => [...prev, newData]);
      } else {
        const updatedData = await update(formData) as User;
        setData(prev => prev.map(item => (item.userId === formData.userId ? updatedData : item)));
      }
      showSuccess(`Saved successfully`)
    } catch (error) {
      console.error('Save operation failed:', error);
      showError('Save failed')
    } finally {
      reset();
      setIsFormModalOpen(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-2 ml-3">User</h2>
      <div className="p-4 mx-auto">
        <div className="mb-6 max-w-full text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Filters Form */}
            <UserFilterForm 
              register={register}
              setValue={setValue} // ⭐ ส่ง setValue
              onSearch={handleSearch} 
            />
            
            <div className="md:col-span-1 flex flex-col justify-between gap-4">
              <div className="flex flex-wrap justify-end gap-2">
                {/* Upload Button */}
                {hasPermission(Menu.User, Action.Upload) && (
                  <UploadButton onUpload={handleUpload} />
                )}

                {/* Export Button */}
                {hasPermission(Menu.User, Action.Export) && (
                  <ExportButton onExport={handleExport} />
                )}
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                {/* Add Button */}
                {hasPermission(Menu.User, Action.Add) && (
                  <button
                    className="flex items-center gap-1 text-white px-4 py-2 rounded btn-primary"
                    onClick={() => handleAddEdit()}
                  >
                    Add
                    <Plus size={16} className="mt-1" />
                  </button>
                )}
                {/* Delete Button */}
                {hasPermission(Menu.User, Action.Delete) && (
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

        {/* Debug Info  */}
        <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
          <strong>Debug Info:</strong> Current Role Name = {watchedRoleName || 'empty'} | 
          Total Users = {data.length} items
        </div>

        {/* DataTable */}
        <DataTable
          columns={UserColumns({
            showCheckbox: hasPermission(Menu.User, Action.Delete),
            canEdit: hasPermission(Menu.User, Action.Edit),
            openEditModal: handleAddEdit,
            selectedIds,
            setSelectedIds,
            data,
          })}
          data={data}
          selectedIds={selectedIds}
          defaultSorting={[{ id: "userId", desc: false }]}
        />

        {/* Add & Edit Modal */}
        {isFormModalOpen && (
          <UserFormModal
            canEdit={hasPermission(Menu.User, Action.Edit)}
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