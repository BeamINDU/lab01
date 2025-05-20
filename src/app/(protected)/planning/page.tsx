'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from 'lucide-react'
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { toastSuccess, toastError } from '@/app/utils/toast';
import { exportText, exportExcel, exportWord, exportCSV } from "@/app/lib/export";
import { ExportType } from '@/app/lib/constants/export-type';
import { Planning, ParamSearch } from "@/app/types/planning"
import { search, detail, create, update, remove, upload } from "@/app/lib/services/planning";
import { usePermission } from '@/app/contexts/permission-context';
import { Menu, Action } from '@/app/lib/constants/menu';
import UploadButton from "@/app/components/common/UploadButton";
import ExportButton from "@/app/components/common/ExportButton";
import DataTable from "@/app/components/table/DataTable";
import PlanningColumns from "./components/planning-column";
import PlanningFilterForm from './components/planning-filter';
import PlanningFormModal from "./components/planning-form";

export default function Page() {
  const { hasPermission } = usePermission();
  const { register, getValues, setValue, reset ,control} = useForm();
  const [data, setData] = useState<Planning[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingData, setEditingData] = useState<Planning | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      const formValues = getValues();
      const param: ParamSearch = {
        planId: formValues.planId || '',
        dateFrom: formValues.dateFrom || '',
        dateTo: formValues.dateTo || '',
        productId: formValues.productId || '',
        lotNo: formValues.lotNo || '',
        lineId: formValues.lineId || '',
      };
      const products = await search(param);
      setData(products);
    } catch (error) {
      console.error("Search operation failed:", error);
      showError('Search failed');
      setData([]);
    }
  };

  const handleExport = (type: ExportType) => {
    const headers = ["Plan ID", "Product ID", "Lot No", "Line ID", "Start Date", "End Date"];
    const keys: (keyof Planning)[] = ["planId", "productId", "lotNo", "lineId", "startDate", "endDate"];
    const fileName = "Planning";
  
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
  
  const handleAddEdit = async (row?: Planning) => {
    try {
      if (row) {
        const updatedRow = await detail(row.productId ?? "") as Planning;
        setEditingData(updatedRow);
      } else {
        reset();
        setEditingData(null);
      }
      setIsFormModalOpen(true);
    } catch (error) {
      console.error('Failed to open modal:', error);
      showError('Failed to load planning details');
    }
  };

  const handleDelete = async () => {
    const result = await showConfirm('Are you sure you want to delete these planning?')
    if (result.isConfirmed) {
      try {
        for (const productTypeId of selectedIds) {
          await remove(productTypeId);
        }
        setData(prev => prev.filter(item => !selectedIds.includes(item.productId ?? "")));
        setSelectedIds([]);
        toastSuccess(`Deleted successfully`);
        showSuccess(`Deleted successfully`)
      } catch (error) {
        console.error('Delete operation failed:', error);
        showError('Delete failed')
      }
    }
  };

  const handleSave = async (formData: Planning) => {
    try {
      if (formData.isCreateMode) {
        const newData = await create(formData) as Planning;
        setData(prev => [...prev, newData]);
      } else {
        const updatedData = await update(formData) as Planning;
        setData(prev => prev.map(item => (item.productId === formData.productId ? updatedData : item)));
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
  

  return (
    <>
      <h2 className="text-2xl font-bold mb-2 ml-3">Planning</h2>
      <div className="p-4 mx-auto">
      <div className="mb-6 max-w-full text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Filters Form */}
            <PlanningFilterForm 
              register={register} 
              control={control}
              onSearch={handleSearch} 
            />
            
            <div className="md:col-span-1 flex flex-col justify-between gap-4">
              <div className="flex flex-wrap justify-end gap-2">
                {/* Upload Button */}
                {hasPermission(Menu.Planning, Action.Upload) && (
                  <UploadButton onUpload={handleUpload} />
                )}

                {/* Export Button */}
                {hasPermission(Menu.Planning, Action.Export) && (
                  <ExportButton onExport={handleExport} />
                )}
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                {/* Add Button */}
                {hasPermission(Menu.Planning, Action.Add) && (
                <button
                  className="flex items-center gap-1 text-white px-4 py-2 rounded btn-primary"
                  onClick={() => handleAddEdit()}
                >
                  Add
                  <Plus size={16} className="mt-1" />
                </button>
                )}
                {/* Delete Button */}
                {hasPermission(Menu.Planning, Action.Delete) && (
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
          columns={PlanningColumns({
            showCheckbox: hasPermission(Menu.Planning, Action.Delete),
            canEdit: hasPermission(Menu.Planning, Action.Edit),
            openEditModal:handleAddEdit,
            selectedIds,
            setSelectedIds,
            data,
          })}
          data={data}
          selectedIds={selectedIds}
          defaultSorting={[{ id: "planId", desc: false }]}
        />

        {/* Add & Edit Modal */}
        {isFormModalOpen && (
          <PlanningFormModal
            canEdit={hasPermission(Menu.Planning, Action.Edit)}
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