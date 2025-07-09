import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import { ModelAssignment } from "@/app/types/model-assignment"
import { formatDateTime } from "@/app/utils/date";
import { formatNumber } from "@/app/utils/format";

interface ModelAssignmentColumnProps {
  showCheckbox?: boolean;
  openEditModal: (row?: ModelAssignment) => void;
  canEdit: boolean
}

export default function ModelAssignmentColumns({ openEditModal, canEdit }: ModelAssignmentColumnProps): ColumnDef<ModelAssignment>[] {
  return [
    {
      accessorKey: "no",
      header: "No",
      enableSorting: false,
    },
    // {
    //   accessorKey: "id",
    //   header: "id",
    // },
    {
      accessorKey: "modelName",
      header: "Model Name",
    },
    {
      accessorKey: "productId",
      header: "Product ID",
    },
    {
      accessorKey: "cameraId",
      header: "Camera ID",
    },
    {
        accessorKey: "versionNo",
        header: "Version No",
        cell: ({ getValue }) => {
          const value = getValue<number>();
          return (
            <div className="text-right">
              {formatNumber(value)}
            </div>
          );
        },
        meta: {
          style: { width: "7%" },
        },
      },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const value = getValue() as boolean;
        const isActive = value === true;
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${
              isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      },
    },    
    {
      accessorKey: "appliedBy",
      header: "Applied By",
    },
    {
      accessorKey: "appliedDate",
      header: "Applied Date",
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
            onClick={() => openEditModal(row.original)}
          >
            {canEdit ? 'Edit' : 'Detail'}
            <SquarePen size={16} />
          </button>
        </div>
      ),
    },
  ];
}
