'use client'

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from 'lucide-react'
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { exportExcel, exportCSV } from "@/app/libs/export";
import { ExportType } from '@/app/constants/export-type';
import { ReportProduct, ProductDetail, ParamSearch, ParamUpdate, ParamDetail } from "@/app/types/report-product-defect"
import { search, detail, update } from "@/app/libs/services/report-product-defect";
import { usePermission } from '@/app/contexts/permission-context';
import { Menu, Action } from '@/app/constants/menu';
import { extractErrorMessage } from '@/app/utils/errorHandler';
import { formatDateTime } from "@/app/utils/date";
import ExportButton from "@/app/components/common/ExportButton";
import DataTable from "@/app/components/table/DataTable2";
import ReportProductColumns from "./components/report-product-column";
import ReportProductFormModal from "./components/report-product-form";
import ReportProductFilterForm from './components/report-product-filter';

export default function Page() {
  const { hasPermission } = usePermission();
  const { register, getValues, setValue, reset, control } = useForm();
  const [data, setData] = useState<ReportProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }>({
    id: 'defecttime',
    desc: true,
  });
  const [editingData, setEditingData] = useState<ProductDetail | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = useCallback(
    async (
      override?: Partial<{
        page: number;
        pageSize: number;
        sorting: { id: string; desc: boolean };
      }>
    ) => {
      try {
        const values = getValues();
        const newPage = override?.page ?? page;
        const newPageSize = override?.pageSize ?? pageSize;
        const newSorting = override?.sorting ?? sorting;

        const params: ParamSearch = {
          dateFrom: values.dateFrom || '',
          dateTo: values.dateTo || '',
          productId: values.productId || '',
          productName: values.productName || '',
          cameraId: values.cameraId || '',
          cameraName: values.cameraName || '',
          defectTypeName: values.defectTypeName || '',
          status: values.status || '',
          page: newPage,
          pageSize: newPageSize,
          order_by: newSorting.id,
          order_dir: newSorting.desc ? 'desc' : 'asc',
        };

        const result = await search(params);
        setData(result.items || []);
        setTotal(result.total || 0);
        setPage(newPage);
        setPageSize(newPageSize);
        setSorting(newSorting);
      } catch (error) {
        console.error('Search failed:', error);
        showError('Search failed');
        setData([]);
      }
    },
    [getValues, page, pageSize, sorting]
  );

  const handleExport = (type: ExportType) => {
    try {
      const headers = ["Datetime", "Product ID", "Product Name", "Sequence", "Defect Detail", "Camera ID", "Camera Name", "Status"];
      const keys: (keyof ReportProduct)[] = ["defecttime", "prodid", "prodname", "prodseq", "defectdetail", "cameraid", "cameraname", "prodstatus"];
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
        const param: ParamDetail = {
          id: row.runningno,
          datetime: formatDateTime(row.defecttime),
          productId: row.prodid,
          sequence: row.prodseq,
          cameraId: row.cameraid,
          imagePath: row.imagepath,
        };
        const dataDetail = await detail(param) ?? row;
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
      const res = await update(formData);
      setData(prev => 
        prev.map(item => item.runningno === formData.id ? { ...item, status: res.status } : item)
      );
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
        <div className="mb-4 max-w-full text-sm">
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

            <div className="md:basis-[20%] flex flex-col justify-end items-end gap-2">
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
          total={total}
          page={page}
          pageSize={pageSize}
          sorting={[sorting]}
          onSortingChange={(updater) => {
            const nextSorting = typeof updater === 'function' ? updater([sorting]) : updater;
            const sort = nextSorting[0] ?? { id: 'defecttime', desc: true };

            setSorting(sort);
            handleSearch({ sorting: sort, page: 1 });
          }}
          onChangePage={(p) => handleSearch({ page: p })}
          onChangePageSize={(s) => handleSearch({ page: 1, pageSize: s })}
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