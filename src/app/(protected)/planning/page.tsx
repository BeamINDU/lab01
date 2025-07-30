'use client'

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from 'lucide-react'
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { exportExcel, exportCSV } from "@/app/libs/export";
import { ExportType } from '@/app/constants/export-type';
import { Planning, ParamSearch } from "@/app/types/planning"
import { search, detail, create, update, remove, upload, start, stop } from "@/app/libs/services/planning";
import { usePermission } from '@/app/contexts/permission-context';
import { useSession } from "next-auth/react";
import { Menu, Action } from '@/app/constants/menu';
import { extractErrorMessage } from '@/app/utils/errorHandler';
import { formatDateTime } from "@/app/utils/date";
import UploadButton from "@/app/components/common/UploadButton";
import ExportButton from "@/app/components/common/ExportButton";
import DataTable from "@/app/components/table/DataTable2";
import PlanningColumns from "./components/planning-column";
import PlanningFilterForm from './components/planning-filter';
import PlanningFormModal from "./components/planning-form";

export default function Page() {
  const { data: session } = useSession();
  const { hasPermission } = usePermission();
  const { register, getValues, setValue, reset ,control} = useForm();
  const [data, setData] = useState<Planning[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }>({
    id: 'planid',
    desc: true,
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingData, setEditingData] = useState<Planning | null>(null);
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
          planId: values.planId || '',
          dateFrom: values.dateFrom || '',
          dateTo: values.dateTo || '',
          productId: values.productId || '',
          productName: values.productName || '',
          lotNo: values.lotNo || '',
          lineId: values.lineId || '',
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
      const headers = ["Plan ID", "Plan Startdate", "Plan Enddate", "Actual Startdate", "Actual Enddate", "Product ID", "Product Name", "Lot No", "Line ID", "Quantity"];
      const keys: (keyof Planning)[] = ["planid", "startdatetime", "enddatetime", "actualstartdatetime", "actualenddatetime", "prodid", "prodname", "prodlot", "prodline", "quantity"];
      const fileName = `Plan_${formatDateTime(new Date(), 'yyyyMMdd_HHmmss')}`;
      
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
    } catch (error) {
      console.error("Upload operation failed:", error);
      showError(`Upload failed: ${extractErrorMessage(error)}`);
    }
  };
  
  const handleAddEdit = async (row?: Planning) => {
    try {
      if (row) {
        // const updatedRow = await detail(row.id ?? "") as Planning;
        const updatedRow = data.find((item) => item.id === row.id) ?? row;
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
        setData(prev => prev.filter(item => !selectedIds.includes(item.id ?? "")));
        setSelectedIds([]);
        showSuccess(`Deleted successfully`)
      } catch (error) {
        console.error('Delete operation failed:', error);
        showError(`Delete failed: ${extractErrorMessage(error)}`);
      }
    }
  };

  const handleSave = async (formData: Planning) => {
    try {
      if (!formData.id) {
        const newData = await create(formData) as Planning;
        setData(prev => [...prev, newData]);
      } else {
        const updatedData = await update(formData?.id ?? "", formData) as Planning;
        setData(prev => prev.map(item => (item.id === formData.id ? updatedData : item)));
      }
      showSuccess(`Saved successfully`)
      reset();
      setIsFormModalOpen(false);
    } catch (error) {
      console.error('Save operation failed:', error);
      showError(`Save failed: ${extractErrorMessage(error)}`);
    }
  };

  const handleStart = async (plan: Planning): Promise<any> => {
    const result = await showConfirm(`Are you sure you want to start planning ${plan.planid}?`)
    if (result.isConfirmed) {
      try {
        const param = { ...plan, updatedby: session?.user?.userid };
        const updated = await start(param);
        setData(prev => prev.map(item => (item.planid === updated.planid ? updated : item)));
        showSuccess(`Start plan successfully`)
      } catch (error) {
        console.error('Start plan operation failed:', error);
        showError(`Start plan failed: ${extractErrorMessage(error)}`);
      }
    }
  };

  const handleStop = async (plan: Planning): Promise<any> => {
    const result = await showConfirm(`Are you sure you want to stop planning${plan.planid}?`)
    if (result.isConfirmed) {
      try {
        const param = { ...plan, updatedby: session?.user?.userid };
        const updated = await stop(param);
        setData(prev => prev.map(item => (item.planid === updated.planid ? updated : item)));
        showSuccess(`Stop plan successfully`)
      } catch (error) {
        console.error('Stop plan operation failed:', error);
        showError(`Stop plan failed: ${extractErrorMessage(error)}`);
      }
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-2 ml-3">Planning</h2>
      <div className="p-4 mx-auto">
      <div className="mb-4 max-w-full text-sm">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Form */}
            <div className="md:basis-[80%]">
              <PlanningFilterForm 
                register={register} 
                control={control}
                setValue={setValue}
                onSearch={handleSearch} 
              />
            </div>
            
            <div className="md:basis-[20%] flex flex-col justify-end items-end gap-2">
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
            onStartPlan: handleStart,
            onStopPlan: handleStop,
            selectedIds,
            setSelectedIds,
            data,
          })}
          selectedIds={selectedIds}
          data={data}
          total={total}
          page={page}
          pageSize={pageSize}
          sorting={[sorting]}
          onSortingChange={(updater) => {
            const nextSorting = typeof updater === 'function' ? updater([sorting]) : updater;
            const sort = nextSorting[0] ?? { id: 'planId', desc: false };

            setSorting(sort);
            handleSearch({ sorting: sort, page: 1 });
          }}
          onChangePage={(p) => handleSearch({ page: p })}
          onChangePageSize={(s) => handleSearch({ page: 1, pageSize: s })}
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