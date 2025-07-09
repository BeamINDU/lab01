import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { SquarePen, Eye } from "lucide-react";
import { ReportProduct } from "@/app/types/report-product-defect"
import { formatDateTime } from "@/app/utils/date";

interface ProductColumnProps {
  showCheckbox?: boolean;
  openDetailModal: (row?: ReportProduct) => void;
  data: ReportProduct[];
  canEdit: boolean
}

export default function productColumns({
  showCheckbox,
  openDetailModal, 
  data,
  canEdit
}: ProductColumnProps): ColumnDef<ReportProduct>[] {
  return [
    {
      accessorKey: "no",
      header: "No",
      enableSorting: false,
    },
    {
      accessorKey: "datetime",
      header: "Datetime",
      cell: ({ getValue }) => {
        const rawValue = getValue() as string | number | Date | null | undefined;
        const formattedDate = formatDateTime(rawValue);
        return <div className="text-center">{formattedDate}</div>;
      },
      meta: {
        style: { width: "15%" },
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
      accessorKey: "defectTypeId",
      header: "Defect Type ID",
    },
    {
      accessorKey: "defectTypeName",
      header: "Defect Type Name",
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
      meta: {
        style: { width: "8%" },
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <button 
            className="flex items-center gap-1 text-xs px-3 py-1 rounded btn-primary"
            onClick={() => openDetailModal(row.original)}
          >
            {canEdit ? 'Detail' : 'View'}
            <Eye size={16} />
          </button>
        </div>
      ),
      meta: {
        style: { width: "8%" },
      },
    },
  ];
}
