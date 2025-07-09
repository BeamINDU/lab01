import { ColumnDef } from "@tanstack/react-table";
import { SquarePen, Eye, Copy } from "lucide-react";
import { DetectionModel } from "@/app/types/detection-model"
import { formatDateTime } from "@/app/utils/date";
import { ModelStatus } from '@/app/constants/status';

interface DetectionModelColumnProps {
  showCheckbox?: boolean;
  onAction: (modelVersionId: number, mode: string, modelName?: string) => void;
  selectedIds: number[];
  setSelectedIds: (updater: (prevState: number[]) => number[]) => void;
  data: DetectionModel[];
  canEdit: boolean
}

export default function DetectionModelColumns({
  showCheckbox,
  onAction,
  selectedIds,
  setSelectedIds,
  data,
  canEdit,
}: DetectionModelColumnProps): ColumnDef<DetectionModel>[] {

  const toggleSelect = (modelVersionId: number) => {
    setSelectedIds((prev) =>
      prev.includes(modelVersionId)
        ? prev.filter((selectedId) => selectedId !== modelVersionId)
        : [...prev, modelVersionId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.length === data.length
        ? []
        : data
          .map((item) => item.modelVersionId)
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
                  data.every((item) => typeof item.modelVersionId === "number" && selectedIds.includes(item.modelVersionId))
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
                checked={selectedIds.includes(row.original.modelVersionId)}
                onChange={() => toggleSelect(row.original.modelVersionId)}
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
      accessorKey: "currentStep",
      header: "Step",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.modelVersionId;
        const statusId = row.original.statusId;
        const modelName = row.original.modelName;

        return (
          <div className="flex items-center justify-center gap-2">
            {typeof id === "number" && canEdit && (
              statusId === ModelStatus.Using ? (
                <button
                  className="w-20 flex items-center justify-center text-center gap-1 text-xs px-3 py-1 rounded bg-purple-600 text-white hover:bg-purple-700"
                  onClick={() => onAction(id, 'duplicate', modelName)}
                >
                  Duplicate
                  {/* <Copy size={16} /> */}
                </button>
              ) : (
                <button
                  className="w-20 flex items-center justify-center text-center gap-1 text-xs px-3 py-1 rounded btn-primary"
                  onClick={() => onAction(id, 'edit')}
                >
                  Edit
                  <SquarePen size={16} />
                </button>
              )
            )}

            {typeof id === "number" && (
              <button
                className="flex items-center gap-1 text-xs px-3 py-1 rounded btn-primary-dark"
                onClick={() => onAction(id, 'view')}
              >
                View
                <Eye size={16} />
              </button>
            )}
          </div>
        );
      },
    }
  ];
}
