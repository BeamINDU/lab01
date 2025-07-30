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
      meta: {
        style: { width: "3%" },
      },
    },
    {
      accessorKey: "defecttime",
      header: "Datetime",
      cell: ({ getValue }) => {
        const rawValue = getValue() as string | number | Date | null | undefined;
        const formattedDate = formatDateTime(rawValue);
        return <div className="text-center">{formattedDate}</div>;
      },
      meta: {
        style: { width: "12%" },
      },
    },
    {
      accessorKey: "prodid",
      header: "Product ID",
      meta: {
        style: { width: "8%" },
      },
    },
    {
      accessorKey: "prodname",
      header: "Product Name",
      meta: {
        style: { width: "15%" },
      },
    },
    // {
    //   accessorKey: "prodseq",
    //   header: "Sequence",
    //   meta: {
    //     style: { width: "5%" },
    //   },
    // },
    {
      accessorKey: "defectdetail",
      header: "Defect Detail",
    },
    {
      accessorKey: "cameraid",
      header: "Camera ID",
      meta: {
        style: { width: "9%" },
      },
    },
    {
      accessorKey: "cameraname",
      header: "Camera Name",
      meta: {
        style: { width: "13%" },
      },
    },
    {
      accessorKey: "prodstatus",
      header: "Status",
      meta: {
        style: { width: "5%" },
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <button
            className="px-1 py-1 flex items-center justify-center text-blue-600 hover:text-blue-800 transition"
            onClick={() => openDetailModal(row.original)}
            title={canEdit ? "Detail" : "View"}
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
