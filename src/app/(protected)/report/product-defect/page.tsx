'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from 'lucide-react'
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { exportText, exportExcel, exportWord, exportCSV } from "@/app/lib/export";
import { ExportType } from '@/app/lib/constants/export-type';
import { ReportProduct, ProductDetail, ParamSearch, ParamUpdate } from "@/app/types/report-product-defect"
import { search, detail, update } from "@/app/lib/services/report-product-defect";
import { usePermission } from '@/app/contexts/permission-context';
import { Menu, Action } from '@/app/lib/constants/menu';
import ExportButton from "@/app/components/common/ExportButton";
import DataTable from "@/app/components/table/DataTable";
import ReportProductColumns from "./components/report-product-column";
import ReportProductFormModal from "./components/report-product-form";
import ReportProductFilterForm from './components/report-product-filter';

export default function Page() {
  const { hasPermission } = usePermission();
  const { register, getValues, setValue, reset, control } = useForm(); 
  const [data, setData] = useState<ReportProduct[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingData, setEditingData] = useState<ProductDetail | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      const formValues = getValues();
      const param: ParamSearch = {
        dateFrom: formValues.dateFrom || '',
        dateTo: formValues.dateTo || '',
        productName: formValues.productName || '',
        defectType: formValues.defectType || '',
        status: formValues.status || '',
      };
      const products = await search(param);
      setData(products);
    } catch (error) {
      console.error("Error search product:", error);
      showError('Error search product');
      setData([]);
    }
  };

  const handleExport = (type: ExportType) => {
    const headers = ["Datetime", "Product Name", "Status", "Defect Type", "Camera ID"];
    const keys: (keyof ReportProduct)[] = ["datetime", "productName", "status", "defectType", "cameraId"];
    const fileName = "Report_Product";
  
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
  
  const handleDetail = async (row?: ReportProduct) => {
    try {
      if (row) {
        const updatedRow = await detail(row.productId ?? "") as ProductDetail;
        
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

  const handleSave = async (formData: ParamUpdate) => {
    try {
      if (formData.productId) {
        const updatedData = await update(formData) as ReportProduct;
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
      <h2 className="text-2xl font-bold mb-2 ml-3">Product Defect Result</h2>
      <div className="p-4 mx-auto">
        <div className="mb-6 max-w-full text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Filters Form - Pass control prop */}
            <ReportProductFilterForm 
              register={register}
              control={control} 
              onSearch={handleSearch} 
            />
            
            <div className="md:col-span-1 flex flex-col justify-end items-end gap-4">
              <div className="flex flex-wrap justify-end gap-2">
                {/* Export Button */}
                {hasPermission(Menu.ReportProductDefect, Action.Export) && (
                  <ExportButton onExport={handleExport} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* DataTable */}
        <DataTable
          columns={ReportProductColumns({
            canEdit: hasPermission(Menu.ReportProductDefect, Action.Edit),
            openDetailModal:handleDetail,
            selectedIds,
            setSelectedIds,
            data,
          })}
          data={data}
          selectedIds={selectedIds}
          defaultSorting={[{ id: "datetime", desc: false }]}
        />

        {/* Add & Edit Modal */}
        {isFormModalOpen && (
          <ReportProductFormModal
            canEdit={hasPermission(Menu.ReportProductDefect, Action.Edit)}
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