"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from 'lucide-react'
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { exportExcel, exportCSV } from "@/app/libs/export";
import { ExportType } from '@/app/constants/export-type';
import { DetectionModel, ParamSearch } from "@/app/types/detection-model"
import { search, create, remove } from "@/app/libs/services/detection-model";
import { usePermission } from '@/app/contexts/permission-context';
import { Menu, Action } from '@/app/constants/menu';
import { extractErrorMessage } from '@/app/utils/errorHandler';
import ExportButton from "@/app/components/common/ExportButton";
import DataTable from "@/app/components/table/DataTable";
import DetectionModelColumns from "./components/detection-model-column";
import DetectionModelFilterForm from './components/detection-model-filter';
import AddModelFormModal from "./components/add-model-form";
import NextTopLoader from 'nextjs-toploader';

export default function Page() {
  const router = useRouter();
  const { hasPermission } = usePermission();
  const { register, getValues, setValue, reset, control } = useForm();
  const [data, setData] = useState<DetectionModel[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editingData, setEditingData] = useState<DetectionModel | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const loaderRef = useRef<any>(null);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      const formValues = getValues();
      const param: ParamSearch = {
        modelName: formValues.modelName || '',
        version: formValues.version || '',
        function: formValues.function || '',
        statusId: formValues.statusId || '',
      };
      const result = await search(param);
      setData(result);
    } catch (error) {
      console.error("Search operation failed:", error);
      showError('Search failed');
      setData([]);
    }
  };

  const handleExport = (type: ExportType) => {
    const headers = ["Model Name", "Version", "Function", "Status" ];
    const keys: (keyof DetectionModel)[] = ["modelName", "currentVersion", "function", "statusId" ];
    const fileName = "Detection Model";
  
    switch (type) {
      case ExportType.CSV:
        exportCSV(data, headers, keys, fileName);
        break;
      case ExportType.Excel:
        exportExcel(data, headers, keys, fileName);
        break;
    }
  };

  const handleAdd = async (row?: DetectionModel | null) => {
    try {
      if (row) {
        setEditingData(row);
      } else {
        reset();
        setEditingData(null);
      }
      setIsFormModalOpen(true);
    } catch (error) {
      console.error('Failed to open modal:', error);
      showError('Failed to load  details');
    }
  };

  const handleEdit = async (modelId: number) => {
    try {
      loaderRef.current?.start();
      router.push(`/detection-model/${modelId}`);
    } catch (error) {
      console.error('Failed to open modal:', error);
      showError('Failed to load  details');
    }
  };

  const handleDelete = async () => {
    const result = await showConfirm('Are you sure you want to delete these detection model?')
    if (result.isConfirmed) {
      try {
        for (const modelId of selectedIds) {
          await remove(modelId);
        }
        setData(prev => prev.filter(item => !selectedIds.includes(item.modelId ?? 0)));
        setSelectedIds([]);
        showSuccess(`Deleted successfully`)
      } catch (error) {
        console.error('Delete operation failed:', error);
        showError('Delete failed')
      }
    }
  };

  const handleSave = async (formData: DetectionModel) => {
    try {
      const newData = await create(formData) as DetectionModel;
      setData(prev => [...prev, newData]);
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
      <NextTopLoader />
      <h2 className="text-2xl font-bold mb-2 ml-3">Detection Model</h2>
      <div className="p-4 mx-auto">
        <div className="mb-6 max-w-full text-sm">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Form */}
            <div className="md:basis-[80%]">
              <DetectionModelFilterForm 
                setValue={setValue}
                register={register} 
                control={control}
                onSearch={handleSearch} 
              />
            </div>
            
            <div className="md:basis-[20%] flex flex-col justify-end items-end gap-4">
              <div className="flex flex-wrap justify-end gap-2">
                {/* Upload Button */}
                {/* {hasPermission(Menu.DetectionModel, Action.Upload) && (
                  <UploadButton onUpload={handleUpload} />
                )} */}

                {/* Export Button */}
                {hasPermission(Menu.DetectionModel, Action.Export) && (
                  <ExportButton onExport={handleExport} />
                )}
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                {/* Add Button */}
                {hasPermission(Menu.DetectionModel, Action.Add) && (
                  <button
                    className="flex items-center gap-1 text-white px-4 py-2 rounded btn-primary"
                    onClick={() => handleAdd()}
                  >
                    Add
                    <Plus size={16} className="mt-1" />
                  </button>
                )}
                {/* Delete Button */}
                {hasPermission(Menu.DetectionModel, Action.Delete) && (
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
          columns={DetectionModelColumns({
            showCheckbox: hasPermission(Menu.DetectionModel, Action.Delete),
            canEdit: hasPermission(Menu.DetectionModel, Action.Edit),
            openEditModal:handleEdit,
            selectedIds,
            setSelectedIds,
            data,
          })}
          data={data}
          selectedIds={selectedIds}
          defaultSorting={[{ id: "modelName", desc: false }]}
        />

        {/* Add Modal */}
        {isFormModalOpen && (
          <AddModelFormModal
            showModal={isFormModalOpen}
            setShowModal={setIsFormModalOpen}
            editingData={editingData}
            onSave={handleSave}
            canEdit={hasPermission(Menu.DetectionModel, Action.Edit)}
          />
        )}

      </div>
    </>
  )
}
