'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from 'lucide-react'
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { exportText, exportExcel, exportWord, exportCSV } from "@/app/lib/export";
import { ExportType } from '@/app/lib/constants/export-type';
import { DefectType, ParamSearch } from "@/app/types/defect-type"
import { search, detail, create, update, remove, upload } from "@/app/lib/services/defect-type";
import { usePermission } from '@/app/contexts/permission-context';
import { Menu, Action } from '@/app/lib/constants/menu';
import UploadButton from "@/app/components/common/UploadButton";
import ExportButton from "@/app/components/common/ExportButton";
import DataTable from "@/app/components/table/DataTable";
import DefectTypeColumns from "./components/defect-type-column";
import DefectTypeFilterForm from './components/defect-type-filter';
import DefectTypeFormModal from "./components/defect-type-form";

export default function Page() {
  const { hasPermission } = usePermission();
  const { register, getValues, setValue, reset } = useForm();
  const [data, setData] = useState<DefectType[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingData, setEditingData] = useState<DefectType | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  useEffect(() => {
    handleSearch();
  }, []);

const handleSearch = async () => {
  try {
    const formValues = getValues();
    console.log('Defect Type search with values:', formValues); 
    
    const param: ParamSearch = {
      defectTypeId: formValues.defectTypeId || '',
      defectTypeName: formValues.defectTypeName || '',
      status: formValues.status !== undefined ? formValues.status : undefined, 
    };
    
    console.log('Defect Type search parameters:', param); 
    
    const defectTypes = await search(param);
    setData(defectTypes);
    
    console.log('Defect Type search results:', defectTypes.length, 'items'); 
  } catch (error) {
    console.error("Search operation failed:", error);
    showError('Search failed');
    setData([]);
  }
};

  const handleExport = (type: ExportType) => {
    const headers = ["Defect Type ID", "Defect Type Name", "Description"];
    const keys: (keyof DefectType)[] = ["defectTypeId","defectTypeName", "description"];
    const fileName = "Product";
  
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
  
  const handleAddEdit = async (row?: DefectType) => {
    try {
      if (row) {
        const result = (await detail(row.defectTypeId ?? "")) ?? (row as DefectType);
        const updatedRow = { ...result, isCreateMode: !row.defectTypeId };
        setEditingData(updatedRow);
      } else {
        reset();
        setEditingData(null);
      }
      setIsFormModalOpen(true);
    } catch (error) {
      console.error('Failed to open modal:', error);
      showError('Failed to load defecttype details');
    }
  };

  const handleDelete = async () => {
    const result = await showConfirm('Are you sure you want to delete these defect type?')
    if (result.isConfirmed) {
      try {
        for (const defectTypeId of selectedIds) {
          await remove(defectTypeId);
        }
        setData(prev => prev.filter(item => !selectedIds.includes(item.defectTypeId ?? "")));
        setSelectedIds([]);
        showSuccess(`Deleted successfully`)
      } catch (error) {
        console.error('Delete operation failed:', error);
        showError('Delete failed')
      }
    }
  };

  const handleSave = async (formData: DefectType) => {
    try {
      if (formData.isCreateMode) {
        const newData = await create(formData) as DefectType;
        setData(prev => [...prev, newData]);
      } else {
        const updatedData = await update(formData) as DefectType;
        setData(prev => prev.map(item => (item.defectTypeId === formData.defectTypeId ? updatedData : item)));
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
      <h2 className="text-2xl font-bold mb-2 ml-3">Defect Type</h2>
      <div className="p-4 mx-auto">
      <div className="mb-6 max-w-full text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Filters Form */}
            <DefectTypeFilterForm 
              register={register} 
              setValue={setValue}
              onSearch={handleSearch} 
            />
            
            <div className="md:col-span-1 flex flex-col justify-between gap-4">
              <div className="flex flex-wrap justify-end gap-2">
                {/* Upload Button */}
                {hasPermission(Menu.DefectType, Action.Upload) && (
                  <UploadButton onUpload={handleUpload} />
                )}

                {/* Export Button */}
                {hasPermission(Menu.DefectType, Action.Export) && (
                  <ExportButton onExport={handleExport} />
                )}
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                {/* Add Button */}
                {hasPermission(Menu.DefectType, Action.Add) && (
                  <button
                    className="flex items-center gap-1 text-white px-4 py-2 rounded btn-primary"
                    onClick={() => handleAddEdit()}
                  >
                    Add
                    <Plus size={16} className="mt-1" />
                  </button>
                )}
                {/* Delete Button */}
                {hasPermission(Menu.DefectType, Action.Delete) && (
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
          columns={DefectTypeColumns({
            showCheckbox: hasPermission(Menu.DefectType, Action.Delete),
            canEdit: hasPermission(Menu.DefectType, Action.Edit),
            openEditModal:handleAddEdit,
            selectedIds,
            setSelectedIds,
            data,
          })}
          data={data}
          selectedIds={selectedIds}
          defaultSorting={[{ id: "defectTypeId", desc: false }]}
        />

        {/* Add & Edit Modal */}
        {isFormModalOpen && (
          <DefectTypeFormModal
            canEdit={hasPermission(Menu.DefectType, Action.Edit)}
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
