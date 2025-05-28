import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import { DetectionModel } from "@/app/types/detection-model"
import { formatDateTime } from "@/app/utils/date";
import { Action } from '@/app/lib/constants/menu';

interface DetectionModelColumnProps {
  showCheckbox?: boolean;
  openEditModal: (modelId: number) => void;
  selectedIds: string[];
  setSelectedIds: (updater: (prevState: string[]) => string[]) => void; 
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

  const toggleSelect = (modelId: string) => {
    setSelectedIds((prev) =>
      prev.includes(modelId) ? prev.filter((selectedId) => selectedId !== modelId) : [...prev, modelId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev: string[]) =>
      prev.length === data.length
        ? []
        : data
          .map((item) => item.modelId)
          .filter((modelId): modelId is number => modelId !== undefined)
          .map(String)
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
                    data.every(item => selectedIds.includes(String(item.modelId)))
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
      accessorKey: "version",
      header: "Version",
    },
    {
      accessorKey: "function",
      header: "Function",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    // {
    //   accessorKey: "status",
    //   header: "Status",
    //   cell: ({ getValue }) => {
    //     const value = getValue() as number;
    //     const isActive = value === 1;
    //     return (
    //       <span
    //         className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${
    //           isActive
    //             ? 'bg-green-100 text-green-800'
    //             : 'bg-red-100 text-red-800'
    //         }`}
    //       >
    //         {isActive ? 'Active' : 'Inactive'}
    //       </span>
    //     );
    //   },
    // },    
    // {
    //   accessorKey: "quantity",
    //   header: "Quantity",
    //   cell: ({ getValue }) => {
    //     const value = getValue<number>();
    //     return (
    //       <div className="text-right">
    //         {formatNumber(value)}
    //       </div>
    //     );
    //   },
    // },
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
            // onClick={() => openEditModal(row.original.modelId)}
          >
            {canEdit ? 'Edit' : 'Detail'}
            <SquarePen size={16} />
          </button>
        </div>
      ),
    },
  ];
}
