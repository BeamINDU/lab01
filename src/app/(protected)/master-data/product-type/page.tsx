'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from 'lucide-react'
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { exportText, exportExcel, exportWord, exportCSV } from "@/app/libs/export";
import { ExportType } from '@/app/constants/export-type';
import { ProductType, ParamSearch } from "@/app/types/product-type"
import { search, detail, create, update, remove, upload } from "@/app/libs/services/product-type";
import { usePermission } from '@/app/contexts/permission-context';
import { Menu, Action } from '@/app/constants/menu';
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
      status: formValues.status !== undefined ? formValues.status : undefined,
    };
    
    const result = await search(param);
    
    // ✅ การจัดการข้อมูลที่รอบคอบ
    let processedData: ProductType[] = [];
    
    if (Array.isArray(result)) {
      processedData = result;
    } else if (result && typeof result === 'object') {
      // ลองหา array ใน property ต่างๆ
      if ('data' in result && Array.isArray(result.data)) {
        processedData = result.data;
      } else if ('items' in result && Array.isArray(result.items)) {
        processedData = result.items;
      } else if ('results' in result && Array.isArray(result.results)) {
        processedData = result.results;
      } else {
        // ถ้าเป็น single object ให้ใส่ใน array
        processedData = [result as ProductType];
      }
    } else if (result === null || result === undefined) {
      processedData = [];
    } else {
      console.warn('Unexpected result format:', result);
      processedData = [];
    }
    
    // ✅ Client-side filtering สำหรับ status
    if (formValues.status !== undefined && formValues.status !== '') {
      const statusFilter = formValues.status === '1'; // ✅ แปลง string เป็ boolean
      processedData = processedData.filter(item => item.status === statusFilter);
    }
    
    // ✅ Client-side filtering สำหรับ productTypeId
    if (formValues.productTypeId && formValues.productTypeId.trim() !== '') {
      processedData = processedData.filter(item => 
        item.productTypeId.toLowerCase().includes(formValues.productTypeId.toLowerCase())
      );
    }
    
    // ✅ Client-side filtering สำหรับ productTypeName
    if (formValues.productTypeName && formValues.productTypeName.trim() !== '') {
      processedData = processedData.filter(item => 
        item.productTypeName.toLowerCase().includes(formValues.productTypeName.toLowerCase())
      );
    }
    
    setData(processedData);
    
  } catch (error) {
    console.error("Search operation failed:", error);
    showError('Search failed');
    setData([]);
  }
};

  const handleExport = (type: ExportType) => {
    const headers = ["Product Type ID", "Product Type Name", "Description", "Status"];
    const keys: (keyof ProductType)[] = ["productTypeId","productTypeName", "description", "status"];
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
      showError(`Upload failed`);
      throw error;
    }
  };
  
const handleAddEdit = async (row?: ProductType) => {
  try {
    if (row) {
      // Edit mode
      const result = (await detail(row.productTypeId ?? "")) ?? (row as ProductType);
      const updatedRow: ProductType = { 
        ...result, 
        isCreateMode: false 
      };
      console.log('Edit mode data:', updatedRow);
      setEditingData(updatedRow);
    } else {
      // Add mode 
      const newData: ProductType = {
        productTypeId: '',
        productTypeName: '',
        description: '',
        status: true, 
        createdDate: undefined,
        createdBy: undefined,
        updatedDate: null,
        updatedBy: null,
        isCreateMode: true
      };
      console.log('Add mode data:', newData);
      setEditingData(newData);
    }
    setIsFormModalOpen(true);
  } catch (error) {
    console.error('Failed to open modal:', error);
    showError('Failed to load product type details');
  }
};

  const handleDelete = async () => {
    const result = await showConfirm('Are you sure you want to delete these product type?')
    if (result.isConfirmed) {
      try {
        for (const productTypeId of selectedIds) {
          await remove(productTypeId);
        }
        setData(prev => prev.filter(item => !selectedIds.includes(item.productTypeId ?? "")));
        setSelectedIds([]);
        showSuccess(`Deleted successfully`)
      } catch (error) {
        console.error('Delete operation failed:', error);
        showError(`Delete failed`)
      }
    }
  };

  const handleSave = async (formData: ProductType) => {
    try {
      if (formData.isCreateMode) {
        const newData = await create(formData) as ProductType;
        const newDataWithFlag: ProductType = { ...newData, isCreateMode: false };
        setData(prev => [...prev, newDataWithFlag]);
      } else {
        const updatedData = await update(formData) as ProductType;
        setData(prev => prev.map(item => (item.productTypeId === formData.productTypeId ? updatedData : item)));
      }
      showSuccess(`Saved successfully`)
    } catch (error) {
      console.error('Save operation failed:', error);
      showError(`Save failed`)
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
