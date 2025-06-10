'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from 'lucide-react'
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { exportExcel, exportCSV } from "@/app/libs/export";
import { ExportType } from '@/app/constants/export-type';
import { ReportDefect, ParamSearch } from "@/app/types/report-defect-summary"
import { search } from "@/app/libs/services/report-defect-summary";
import { usePermission } from '@/app/contexts/permission-context';
import { Menu, Action } from '@/app/constants/menu';
import { extractErrorMessage } from '@/app/utils/errorHandler';
import { formatDateTime } from "@/app/utils/date";
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
        productTypeName: formValues.productType || '',
        defectTypeName: formValues.defectType || '',
      };
      const products = await search(param);
      setData(products);
    } catch (error) {
      console.error("Error search report-defect:", error);
      showError(`Search failed`);
      setData([]);
    }
  };

  const handleExport = (type: ExportType) => {
    try {
      const headers = ["Lot No", "Product Type", "Defect Type", "Total", "OK", "NG"];
      const keys: (keyof ReportDefect)[] = ["lotNo", "productTypeName", "defectTypeName", "total", "ok", "ng"];
      const fileName = `ReportDefectSummary_${formatDateTime(new Date(), 'yyyyMMdd_HHmmss')}`;
        
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

  return (
    <>
      <h2 className="text-2xl font-bold mb-2 ml-3">Report Defect Summary</h2>
      <div className="p-4 mx-auto">
      <div className="mb-6 max-w-full text-sm">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Form */}
            <div className="md:basis-[80%]">
              <ReportDefectFilterForm 
                register={register} 
                setValue={setValue}
                onSearch={handleSearch} 
              />
            </div>
            
            <div className="md:basis-[20%] flex flex-col justify-end items-end gap-4">
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
