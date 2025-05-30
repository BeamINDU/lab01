import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import { DetectionModel } from "@/app/types/detection-model"
import { formatDateTime } from "@/app/utils/date";
import { ModelStatus } from '@/app/constants/status';

interface DetectionModelColumnProps {
  showCheckbox?: boolean;
  openEditModal: (modelId: number) => void;
  selectedIds: number[];
  setSelectedIds: (updater: (prevState: number[]) => number[]) => void;
  data: DetectionModel[];
  canEdit: boolean
}

export default function DetectionModelColumns({
  showCheckbox,
  openEditModal, 
  selectedIds,
  setSelectedIds,
  data,
  canEdit,
}: DetectionModelColumnProps): ColumnDef<DetectionModel>[] {

  const toggleSelect = (modelId: number) => {
    setSelectedIds((prev) =>
      prev.includes(modelId)
        ? prev.filter((selectedId) => selectedId !== modelId)
        : [...prev, modelId]
    );
  };
  
  const toggleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.length === data.length
        ? []
        : data
            .map((item) => item.modelId)
            .filter((id): id is number => typeof id === "number")
    );
  };
  

  return [
    ...(showCheckbox
      ? [
          {
            id: "select",
            header: () => (
              <div className="flex justify-center items-center">
                <input
                  type="checkbox"
                  checked={
                    data.length > 0 &&
                    selectedIds.length === data.length &&
                    data.every((item) => typeof item.modelId === "number" && selectedIds.includes(item.modelId))
                  }
                  onChange={toggleSelectAll}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                />
              </div>
            ),
            cell: ({ row }) => (
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(row.original.modelId)}
                  onChange={() => toggleSelect(row.original.modelId)} 
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                />
              </div>
            ),
            meta: {
              style: {
                width: '30px',
              },
            },
          }
        ]
      : []),
    {
      accessorKey: "no",
      header: "No",
      enableSorting: false,
    },
    {
      accessorKey: "modelName",
      header: "Model Name",
    },
    {
      accessorKey: "currentVersion",
      header: "Version",
    },
    {
      accessorKey: "function",
      header: "Function",
    },
    {
      accessorKey: "statusId",
      header: "Status",
      cell: ({ getValue }) => {
        const rawValue = getValue();
        const value = typeof rawValue === "string" ? rawValue : String(rawValue);
    
        const statusMap: Record<string, { label: string; className: string }> = {
          Using: { label: "Using", className: "bg-green-100 text-green-800" },
          Processing: { label: "Processing", className: "bg-yellow-100 text-yellow-800" },
          Ready: { label: "Ready", className: "bg-blue-100 text-blue-800" },
        };
    
        const status = statusMap[value] || { label: "Unknown", className: "bg-gray-100 text-gray-800" };
    
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${status.className}`}
          >
            {status.label}
          </span>
        );
      },
    },    
    {
      accessorKey: "createdBy",
      header: "Created By",
    },
    {
      accessorKey: "createdDate",
      header: "Created Date",
      cell: ({ getValue }) => {
        const rawValue = getValue() as string | number | Date | null | undefined;
        const formattedDate = formatDateTime(rawValue);
        return <div className="text-center">{formattedDate}</div>;
      },
    },
    {
      accessorKey: "updatedBy",
      header: "Updated By",
    },
    {
      accessorKey: "updatedDate",
      header: "Updated Date",
      cell: ({ getValue }) => {
        const rawValue = getValue() as string | number | Date | null | undefined;
        const formattedDate = formatDateTime(rawValue);
        return <div className="text-center">{formattedDate}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <button 
            className="flex items-center gap-1 text-xs px-3 py-1 rounded btn-primary"
            onClick={() => {
              const id = row.original.modelId;
              if (typeof id === "number") {
                openEditModal(id);
              }
            }}
          >
            {canEdit ? 'Edit' : 'Detail'}
            <SquarePen size={16} />
          </button>
        </div>
      ),
    },
  ];
}
