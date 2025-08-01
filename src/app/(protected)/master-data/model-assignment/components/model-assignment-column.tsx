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
    {
      accessorKey: "modelName",
      header: "Model Name",
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
      accessorKey: "productId",
      header: "Product ID",
    },
    {
      accessorKey: "productName",
      header: "Product Name",
    },
    {
      accessorKey: "cameraId",
      header: "Camera ID",
    },
    {
      accessorKey: "cameraName",
      header: "Camera Name",
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
      meta: {
        style: { width: "9%" },
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
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <button
            className="px-1 py-1 flex items-center justify-center text-blue-600 hover:text-blue-800 transition"
            onClick={() => openEditModal(row.original)}
            title={canEdit ? "Edit" : "Detail"}
          >
            <SquarePen size={18} />
          </button>
        </div>
      ),
      meta: {
        style: { width: "3%" },
      },
    },
  ];
}
