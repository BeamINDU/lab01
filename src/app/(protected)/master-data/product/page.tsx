'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from 'lucide-react'
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { exportText, exportExcel, exportWord, exportCSV } from "@/app/lib/export";
import { ExportType } from '@/app/lib/constants/export-type';
import { Product, ParamSearch } from "@/app/types/product"
import { search, detail, create, update, remove, upload } from "@/app/lib/services/product";
import { usePermission } from '@/app/contexts/permission-context';
import { Menu, Action } from '@/app/lib/constants/menu';
import UploadButton from "@/app/components/common/UploadButton";
import ExportButton from "@/app/components/common/ExportButton";
import DataTable from "@/app/components/table/DataTable";
import ProductColumns from "./components/product-column";
import ProductFormModal from "./components/product-form";
import ProductFilterForm from './components/product-filter';

export default function Page() {
  const { hasPermission } = usePermission();
  const { register, getValues, setValue, reset, watch } = useForm();
  const [data, setData] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingData, setEditingData] = useState<Product | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Watch สำหรับ productType เพื่อ debug
  const watchedProductType = watch("productType");

  useEffect(() => {
    handleSearch();
  }, []);


  useEffect(() => {
    console.log('Current productType value:', watchedProductType);
  }, [watchedProductType]);

  const handleSearch = async () => {
    try {
      const formValues = getValues();
      console.log('Search with form values:', formValues); 
      
      const param: ParamSearch = {
        productId: formValues.productId || '',
        productName: formValues.productName || '',
        productTypeName: formValues.productType || '', 
        serialNo: formValues.serialNo || '',
        status: formValues.status !== undefined ? formValues.status : undefined,
      };
      
      console.log('Search parameters:', param); 
      
      const products = await search(param);
      setData(products);
      
      console.log('Search results:', products); 
    } catch (error) {
      console.error("Search operation failed:", error);
      showError('Search failed');
      setData([]);
    }
  };

  const handleExport = (type: ExportType) => {
    const headers = ["Product ID", "Product Name", "Product Type", "Serial No" ];
    const keys: (keyof Product)[] = ["productId","productName", "productTypeName", "serialNo" ];
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
  
  const handleAddEdit = async (row?: Product) => {
    try {
      if (row) {
        const result = (await detail(row.productId ?? "")) ?? (row as Product);
        const updatedRow = { ...result, isCreateMode: !row.productId };
        setEditingData(updatedRow);
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
    const result = await showConfirm('Are you sure you want to delete these product type?')
    if (result.isConfirmed) {
      try {
        for (const productId of selectedIds) {
          await remove(productId);
        }
        setData(prev => prev.filter(item => !selectedIds.includes(item.productId ?? "")));
        setSelectedIds([]);
        showSuccess(`Deleted successfully`)
      } catch (error) {
        console.error('Delete operation failed:', error);
        showError('Delete failed')
      }
    }
  };

  const handleSave = async (formData: Product) => {
    try {
      if (formData.isCreateMode) {
        const newData = await create(formData) as Product;
        setData(prev => [...prev, newData]);
      } else {
        const updatedData = await update(formData) as Product;
        setData(prev => prev.map(item => (item.productId === formData.productId ? updatedData : item)));
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
      <h2 className="text-2xl font-bold mb-2 ml-3">Product</h2>
      <div className="p-4 mx-auto">
        <div className="mb-6 max-w-full text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Filters Form */}
            <ProductFilterForm 
              register={register}
              setValue={setValue}
              onSearch={handleSearch} 
            />
            
            <div className="md:col-span-1 flex flex-col justify-between gap-4">
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
            openEditModal:handleAddEdit,
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