'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from 'lucide-react'
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { exportExcel, exportCSV } from "@/app/libs/export";
import { ExportType } from '@/app/constants/export-type';
import { ReportProduct, ProductDetail, ParamSearch, ParamUpdate } from "@/app/types/report-product-defect"
import { search, detail, update } from "@/app/libs/services/report-product-defect";
import { usePermission } from '@/app/contexts/permission-context';
import { Menu, Action } from '@/app/constants/menu';
import { extractErrorMessage } from '@/app/utils/errorHandler';
import { formatDateTime } from "@/app/utils/date";
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
        productId: formValues.productId || '',
        defectTypeId: formValues.defectTypeId || '',
        cameraId: formValues.cameraId || '',
      };
      const products = await search(param);
      setData(Array.isArray(products) ? products : []);
    } catch (error) {
      console.error("Error search product:", error);
      showError('Error search product');
      setData([]);
    }
  };

  const handleExport = (type: ExportType) => {
    try {
      const headers = ["Datetime", "Product ID", "Defect Type ID", "Camera ID", "Status"];
      const keys: (keyof ReportProduct)[] = ["datetime", "productId", "defectTypeId", "cameraId", "status"];
      const fileName = `ReportProductDefect_${formatDateTime(new Date(), 'yyyyMMdd_HHmmss')}`;
    
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
  
  const handleDetail = async (row?: ReportProduct) => {
    try {
      if (row) {
        // const data = await detail(row.productId) ?? row;
        const result = data.find((item) => item.productId === row.productId) ?? row;
        const dataDetail: ProductDetail = {
          ...result,
          serialNo: '',
          date: '',
          time: '',
          lotNo: '',
          history: [],
          comment: '',
        };
        setEditingData(dataDetail); 
      } else {
        reset();
        setEditingData(null);
      }
      setIsFormModalOpen(true);
    } catch (error) {
      console.error('Failed to load product detail:', error);
      showError('Failed to load product details');
    }
  };

  const handleSave = async (formData: ParamUpdate) => {
    try {
      if (formData.id) {
        const updatedData = await update(formData.id, formData) as ProductDetail;
        setData(prev => 
          prev.map(item => item.id === formData.id ? { ...item, ...updatedData } : item)
        );
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
      <h2 className="text-2xl font-bold mb-2 ml-3">Product Defect Result</h2>
      <div className="p-4 mx-auto">
        <div className="mb-6 max-w-full text-sm">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Form */}
            <div className="md:basis-[80%]">
              <ReportProductFilterForm 
                register={register}
                control={control} 
                setValue={setValue}
                onSearch={handleSearch} 
              />
            </div>

            <div className="md:basis-[20%] flex flex-col justify-end items-end gap-4">
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
            openDetailModal: handleDetail,
            data,
          })}
          data={data}
          defaultSorting={[{ id: "datetime", desc: true }]}
        />

        {/* Detail Modal */}
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