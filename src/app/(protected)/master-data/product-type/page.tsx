'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from 'lucide-react'
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { exportExcel, exportCSV } from "@/app/libs/export";
import { ExportType } from '@/app/constants/export-type';
import { ProductType, ParamSearch } from "@/app/types/product-type"
import { search, detail, create, update, remove, upload } from "@/app/libs/services/product-type";
import { usePermission } from '@/app/contexts/permission-context';
import { Menu, Action } from '@/app/constants/menu';
import { extractErrorMessage } from '@/app/utils/errorHandler';
import { formatDateTime } from "@/app/utils/date";
import UploadButton from "@/app/components/common/UploadButton";
import ExportButton from "@/app/components/common/ExportButton";
import DataTable from "@/app/components/table/DataTable";
import ProductTypeColumns from "./components/product-type-column";
import ProductTypeFilterForm from './components/product-type-filter';
import ProductTypeFormModal from "./components/product-type-form";


export default function Page() {
  const { hasPermission } = usePermission();
  const { register, getValues, setValue, reset } = useForm();
  const [data, setData] = useState<ProductType[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingData, setEditingData] = useState<ProductType | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  useEffect(() => {
    handleSearch();
  }, []);

const handleSearch = async () => {
    try {
      const formValues = getValues();
      const param: ParamSearch = {
        productTypeId: formValues.productTypeId || '',
        productTypeName: formValues.productTypeName || '',
        status: formValues.status || undefined,
      };
      const products = await search(param);
      setData(products);
    } catch (error) {
      console.error("Failed to search producttype:", error);
      setData([]);
      showError(`Search failed`);
    }
  };
  const handleExport = (type: ExportType) => {
    try {
      const headers = ["Product Type ID", "Product Type Name", "Description", "Status"];
      const keys: (keyof ProductType)[] = ["productTypeId","productTypeName", "description", "statusName"];
      const fileName = `ProductType_${formatDateTime(new Date(), 'yyyyMMdd_HHmmss')}`;
    
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
      await upload(file);
      showSuccess(`Uploaded: ${file.name}`);
    } catch (error) {
      console.error("Upload operation failed:", error);
      showError(`Upload failed: ${extractErrorMessage(error)}`);
    }
  };
  
  const handleAddEdit = async (row?: ProductType) => {
    try {
      if (row) {
        // const result = await detail(row.id ?? "");
        const result = data.find((item) => item.id === row.id) ?? row;
        setEditingData(result);
      } else {
        reset();
        setEditingData(null);
      }
      setIsFormModalOpen(true);
    } catch (error) {
      console.error('Delete operation failed:', error);
      showError(`Failed to load details`);
    }
  };

  const handleDelete = async () => {
    const result = await showConfirm('Are you sure you want to delete these product type?')
    if (result.isConfirmed) {
      try {
        for (const id of selectedIds) {
          await remove(id);
        }
        setData(prev => prev.filter(item => !selectedIds.includes(item.id ?? "")));
        setSelectedIds([]);
        showSuccess(`Deleted successfully`)
      } catch (error) {
        console.error('Delete operation failed:', error);
        showError(`Delete failed: ${extractErrorMessage(error)}`);
      }
    }
  };

  const handleSave = async (formData: ProductType) => {
    try {
      if (!formData.id) {
        const newData = await create(formData) as ProductType;
        setData(prev => [...prev, newData]);
        // const newDataWithFlag: ProductType = { ...newData };
        // setData(prev => [...prev, newDataWithFlag]);
      } else {
        const updatedData = await update(formData?.id ?? "", formData) as ProductType;
        setData(prev => prev.map(item => (item.id === formData.id ? updatedData : item)));
      }
      showSuccess(`Saved successfully`)
    } catch (error) {
      console.error('Save operation failed:', error);
      showError(`Save failed: ${extractErrorMessage(error)}`);
    } finally {
      reset();
      setIsFormModalOpen(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-2 ml-3">Product Type</h2>
      <div className="p-4 mx-auto">
        <div className="mb-6 max-w-full text-sm">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Form */}
            <div className="md:basis-[80%]">
              <ProductTypeFilterForm 
                register={register} 
                setValue={setValue}
                onSearch={handleSearch} 
              />
            </div>
            
            <div className="md:basis-[20%] flex flex-col justify-end items-end gap-4">
              <div className="flex flex-wrap justify-end gap-2">
                {/* Upload Button */}
                {hasPermission(Menu.ProductType, Action.Upload) && (
                  <UploadButton onUpload={handleUpload} />
                )}

                {/* Export Button */}
                {hasPermission(Menu.ProductType, Action.Export) && (
                  <ExportButton onExport={handleExport} />
                )}
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                {/* Add Button */}
                {hasPermission(Menu.ProductType, Action.Add) && (
                  <button
                    className="flex items-center gap-1 text-white px-4 py-2 rounded btn-primary"
                    onClick={() => handleAddEdit()}
                  >
                    Add
                    <Plus size={16} className="mt-1" />
                  </button>
                )}
                {/* Delete Button */}
                {hasPermission(Menu.ProductType, Action.Delete) && (
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
          columns={ProductTypeColumns({
            showCheckbox: hasPermission(Menu.ProductType, Action.Delete),
            canEdit: hasPermission(Menu.ProductType, Action.Edit),
            openEditModal:handleAddEdit,
            selectedIds,
            setSelectedIds,
            data,
          })}
          data={data}
          selectedIds={selectedIds}
          defaultSorting={[{ id: "productTypeId", desc: false }]}
        />

        {/* Add & Edit Modal */}
        {isFormModalOpen && (
          <ProductTypeFormModal
            canEdit={hasPermission(Menu.ProductType, Action.Edit)}
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
