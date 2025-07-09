'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from 'lucide-react'
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { exportExcel, exportCSV } from "@/app/libs/export";
import { ExportType } from '@/app/constants/export-type';
import { Product, ParamSearch } from "@/app/types/product"
import { search, detail, create, update, remove, upload } from "@/app/libs/services/product";
import { usePermission } from '@/app/contexts/permission-context';
import { useSession } from "next-auth/react";
import { Menu, Action } from '@/app/constants/menu';
import { extractErrorMessage } from '@/app/utils/errorHandler';
import { formatDateTime } from "@/app/utils/date";
import UploadButton from "@/app/components/common/UploadButton";
import ExportButton from "@/app/components/common/ExportButton";
import DataTable from "@/app/components/table/DataTable";
import ProductColumns from "./components/product-column";
import ProductFormModal from "./components/product-form";
import ProductFilterForm from './components/product-filter';

export default function Page() {
  const { data: session } = useSession();
  const { hasPermission } = usePermission();
  const { register, getValues, setValue, reset } = useForm();
  const [data, setData] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingData, setEditingData] = useState<Product | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      const formValues = getValues();
      
      const param: ParamSearch = {
        productId: formValues.productId || '',
        productName: formValues.productName || '',
        productTypeId: formValues.productTypeId || '', 
        serialNo: formValues.serialNo || '',
        status: formValues.status,
      };
      
      const products = await search(param);
      setData(Array.isArray(products) ? products : []);
    } catch (error) {
      console.error("Search operation failed:", error);
      showError('Search failed');
      setData([]);
    }
  };

  const handleExport = (type: ExportType) => {
    try {
      const headers = ["Product ID", "Product Name", "Product Type ID", "Serial No", "Status"];
      const keys: (keyof Product)[] = ["productId", "productName", "productTypeId", "serialNo", "statusName"];
      const fileName = `Product_${formatDateTime(new Date(), 'yyyyMMdd_HHmmss')}`;
    
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
      handleSearch(); 
    } catch (error) {
      console.error("Upload operation failed:", error);
      showError(`Upload failed: ${extractErrorMessage(error)}`);
    }
  };
  
  const handleAddEdit = async (row?: Product) => {
    try {
      if (row) {
        // const result = (await detail(row.id ?? "")) ?? (row as Product);
        const result = data.find((item) => item.id === row.id) ?? row;
        setEditingData(result);
      } else {
        reset();
        setEditingData(null);
      }
      setIsFormModalOpen(true);
    } catch (error) {
      console.error('Failed to open modal:', error);
      showError('Failed to load product details');
    }
  };

  const handleDelete = async () => {
    const result = await showConfirm('Are you sure you want to delete these products?')
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

  const handleSave = async (formData: Product) => {
    try {
      if (!formData.id) {
        const newData = await create(formData) as Product;
        setData(prev => [...prev, newData]);
      } else {
        const updatedData = await update(formData?.id ?? "", formData) as Product;
        setData(prev => prev.map(item => item.id === formData.id ? updatedData : item ));
      }
      showSuccess('Product updated successfully');
      reset();
      setIsFormModalOpen(false);
    } catch (error) {
      console.error('Save operation failed:', error);
      showError(`Save failed: ${extractErrorMessage(error)}`);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-2 ml-3">Product</h2>
      <div className="p-4 mx-auto">
        <div className="mb-6 max-w-full text-sm">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Form */}
            <div className="md:basis-[80%]">
              <ProductFilterForm 
                register={register}
                setValue={setValue}
                onSearch={handleSearch} 
              />
            </div>
            
            <div className="md:basis-[20%] flex flex-col justify-end items-end gap-4">
              <div className="flex flex-wrap justify-end gap-2">
                {/* Upload Button */}
                {hasPermission(Menu.Product, Action.Upload) && (
                  <UploadButton onUpload={handleUpload} />
                )}

                {/* Export Button */}
                {hasPermission(Menu.Product, Action.Export) && (
                  <ExportButton onExport={handleExport} />
                )}
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                {/* Add Button */}
                {hasPermission(Menu.Product, Action.Add) && (
                  <button
                    className="flex items-center gap-1 text-white px-4 py-2 rounded btn-primary"
                    onClick={() => handleAddEdit()}
                  >
                    Add
                    <Plus size={16} className="mt-1" />
                  </button>
                )}
                {/* Delete Button */}
                {hasPermission(Menu.Product, Action.Delete) && (
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
          columns={ProductColumns({
            showCheckbox: hasPermission(Menu.Product, Action.Delete),
            canEdit: hasPermission(Menu.Product, Action.Edit),
            openEditModal: handleAddEdit,
            selectedIds,
            setSelectedIds,
            data,
          })}
          data={data}
          selectedIds={selectedIds}
          defaultSorting={[{ id: "productId", desc: false }]}
        />

        {/* Add & Edit Modal */}
        {isFormModalOpen && (
          <ProductFormModal
            showModal={isFormModalOpen}
            setShowModal={setIsFormModalOpen}
            editingData={editingData}
            onSave={handleSave}
            canEdit={hasPermission(Menu.Product, Action.Edit)}
          />
        )}
      </div>
    </>
  )
}