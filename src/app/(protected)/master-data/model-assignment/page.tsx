'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from 'lucide-react'
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { exportExcel, exportCSV } from "@/app/libs/export";
import { ExportType } from '@/app/constants/export-type';
import { ModelAssignment, ParamSearch } from "@/app/types/model-assignment"
import { search, update } from "@/app/libs/services/model-assignment";
import { usePermission } from '@/app/contexts/permission-context';
import { useSession } from "next-auth/react";
import { Menu, Action } from '@/app/constants/menu';
import { extractErrorMessage } from '@/app/utils/errorHandler';
import { formatDateTime } from "@/app/utils/date";
import UploadButton from "@/app/components/common/UploadButton";
import ExportButton from "@/app/components/common/ExportButton";
import DataTable from "@/app/components/table/DataTable";
import ModelAssignmentColumns from "./components/model-assignment-column";
import ModelAssignmentFilterForm from './components/model-assignment-filter';
import ModelAssignmentFormModal from "./components/model-assignment-form";

export default function Page() {
  const { data: session } = useSession();
  const { hasPermission } = usePermission();
  const { register, getValues, setValue, reset } = useForm();
  const [data, setData] = useState<ModelAssignment[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingData, setEditingData] = useState<ModelAssignment | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      const formValues = getValues();
      const param: ParamSearch = {
        modelName: formValues.modelName || '',
        productId: formValues.productId || '',
        cameraId: formValues.cameraId || '',
        versionNo: formValues.versionNo,
        status: formValues.status,
      };
      const models = await search(param);
      setData(Array.isArray(models) ? models : []);
    } catch (error) {
      console.error("Error search model assignment:", error);
      showError('Error search model assignment');
      setData([]);
    }
  };

  const handleExport = (type: ExportType) => {
    try {
      const headers = ["Model Name", "Product ID", "Camera ID", "Version No", "Status"];
      const keys: (keyof ModelAssignment)[] = ["modelName", "productId", "cameraId", "versionNo", "statusName"];
      const fileName = `Model_Assignment_${formatDateTime(new Date(), 'yyyyMMdd_HHmmss')}`;

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

  const handleAddEdit = async (row?: ModelAssignment) => {
    try {
      if (row) {
        // const result = (await detail(row.id ?? "")) ?? (row as ModelAssignment);
        const result = data.find((item) => item.id === row.id) ?? row;
        setEditingData(result);
      } else {
        reset();
        setEditingData(null);
      }
      setIsFormModalOpen(true);
    } catch (error) {
      console.error('Failed to open modal:', error);
      showError('Failed to load model assignment details');
    }
  };

  const handleSave = async (formData: ModelAssignment) => {
    try {
      if (formData.id) {
        const updatedData = await update(formData.id, formData) as ModelAssignment;
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

  return (
    <>
      <h2 className="text-2xl font-bold mb-2 ml-3">Model Assignment</h2>
      <div className="p-4 mx-auto">
        <div className="mb-6 max-w-full text-sm">
          <div className="flex flex-col md:flex-row gap-6">
            {/* ModelAssignmentFilterForm */}
            <div className="md:basis-[80%]">
              <ModelAssignmentFilterForm
                register={register}
                setValue={setValue}
                onSearch={handleSearch}
              />
            </div>

            <div className="md:basis-[20%] flex flex-col justify-end items-end gap-4">
              <div className="flex flex-wrap justify-end gap-2">
                {/* Upload Button */}
                {/* {hasPermission(Menu.ModelAssignment, Action.Upload) && (
                  <UploadButton onUpload={handleUpload} />
                )} */}

                {/* Export Button */}
                {hasPermission(Menu.ModelAssignment, Action.Export) && (
                  <ExportButton onExport={handleExport} />
                )}
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                {/* Add Button */}
                {/* {hasPermission(Menu.ModelAssignment, Action.Add) && (
                  <button
                    className="flex items-center gap-1 text-white px-4 py-2 rounded btn-primary"
                    onClick={() => handleAddEdit()}
                  >
                    Add
                    <Plus size={16} className="mt-1" />
                  </button>
                )} */}
                {/* Delete Button */}
                {/* {hasPermission(Menu.ModelAssignment, Action.Delete) && (
                  <button
                    className={`flex items-center gap-1 px-4 py-2 rounded ${selectedIds.length === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "btn-danger"}`}
                    disabled={selectedIds.length === 0}
                    onClick={handleDelete}
                  >
                    Delete
                    <Trash2 size={16} />
                  </button>
                )} */}
              </div>
            </div>
          </div>
        </div>

        {/* DataTable */}
        <DataTable
          columns={ModelAssignmentColumns({
            // showCheckbox: hasPermission(Menu.ModelAssignment, Action.Delete),
            canEdit: hasPermission(Menu.ModelAssignment, Action.Edit),
            openEditModal: handleAddEdit,
            // selectedIds,
            // setSelectedIds,
            // data,
          })}
          data={data}
          selectedIds={selectedIds}
          defaultSorting={[{ id: "Id", desc: false }]}
        />

        {/* Add & Edit Modal */}
        {isFormModalOpen && (
          <ModelAssignmentFormModal
            canEdit={hasPermission(Menu.ModelAssignment, Action.Edit)}
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