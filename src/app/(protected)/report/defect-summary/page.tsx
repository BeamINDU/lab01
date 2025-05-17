'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from 'lucide-react'
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { toastSuccess, toastError } from '@/app/utils/toast';
import { exportText, exportExcel, exportWord, exportCSV } from "@/app/lib/export";
import { ExportType } from '@/app/lib/constants/export-type';
import { ReportDefect, ParamSearch } from "@/app/types/report-defect-summary"
import { search, detail } from "@/app/lib/services/report-defect-summary";
import { usePermission } from '@/app/contexts/permission-context';
import { Menu, Action } from '@/app/lib/constants/menu';
import UploadButton from "@/app/components/common/UploadButton";
import ExportButton from "@/app/components/common/ExportButton";
import DataTable from "@/app/components/table/DataTable";
import ReportDefectColumns from "./components/report-defect-column";
import ReportDefectFilterForm from './components/report-defect-filter';

export default function Page() {
  const { hasPermission } = usePermission();
  const { register, getValues, setValue, reset } = useForm();
  const [data, setData] = useState<ReportDefect[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingData, setEditingData] = useState<ReportDefect | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      const formValues = getValues();
      const param: ParamSearch = {
        lotNo: formValues.lotNo || '',
        productType: formValues.productType || '',
      };
      const products = await search(param);
      setData(products);
    } catch (error) {
      console.error("Error search report-defect:", error);
      showError('Error search report-defect');
      setData([]);
    }
  };

  const handleExport = (type: ExportType) => {
    const headers = ["Lot No", "Product Type", "Defect Type", "Total", "OK", "NG"];
    const keys: (keyof ReportDefect)[] = ["lotNo", "productType", "defectType", "total", "ok", "ng"];
    const fileName = "Report_Defect_Summary";
  
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
      // await upload(file);
      showSuccess(`Uploaded: ${file.name}`);
    } catch (error) {
      console.error("Upload operation failed:", error);
      showError("Upload failed");
      throw error;
    }
  };
  
  return (
    <>
      <h2 className="text-2xl font-bold mb-2 ml-3">Report Defect Summary</h2>
      <div className="p-4 mx-auto">
      <div className="mb-6 max-w-full text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Filters Form */}
            <ReportDefectFilterForm 
              register={register} 
              onSearch={handleSearch} 
            />
            
            <div className="md:col-span-1 flex flex-col justify-end items-end gap-4">
              <div className="flex flex-wrap justify-end gap-2">
                {/* Export Button */}
                {hasPermission(Menu.ReportDefectSummary, Action.Export) && (
                  <ExportButton onExport={handleExport} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* DataTable */}
        <DataTable
          columns={ReportDefectColumns()}
          data={data}
          selectedIds={selectedIds}
          defaultSorting={[{ id: "lotNo", desc: false }]}
        />
        
      </div>
    </>
  )
}
