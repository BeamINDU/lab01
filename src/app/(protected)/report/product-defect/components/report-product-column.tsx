import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { SquarePen, Eye } from "lucide-react";
import { ReportProduct } from "@/app/types/report-product-defect"
import { formatNumber, formatDate } from "@/app/utils/format";

interface ProductColumnProps {
  showCheckbox?: boolean;
  openDetailModal: (row?: ReportProduct) => void;
  selectedIds: string[];
  setSelectedIds: (updater: (prevState: string[]) => string[]) => void; 
  data: ReportProduct[];
  canEdit: boolean
}

export default function productColumns({
  showCheckbox,
  openDetailModal, 
  selectedIds,
  setSelectedIds,
  data,
  canEdit
}: ProductColumnProps): ColumnDef<ReportProduct>[] {

  const toggleSelect = (productId: string) => {
    setSelectedIds((prev) =>
      prev.includes(productId) ? prev.filter((selectedId) => selectedId !== productId) : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev: string[]) =>
      prev.length === data.length
        ? [] // If all items are selected, unselect all
        : data
          .map((item) => item.productId) // Map to ids
          .filter((productId): productId is string => productId !== undefined) // Filter out undefined values
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
                  checked={selectedIds.length === data.length && data.every(item => selectedIds.includes(item.productId ?? ""))}
                  onChange={toggleSelectAll}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                />
              </div>
            ),
            cell: ({ row }) => (
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(row.original.productId)} 
                  onChange={() => toggleSelect(row.original.productId)} 
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
      accessorKey: "datetime",
      header: "Datetime",
      cell: ({ getValue }) => {
        const rawValue = getValue() as string | number | Date | null | undefined;
        const formattedDate = formatDate(rawValue);
        return <div className="text-center">{formattedDate}</div>;
      },
    },
    // {
    //   accessorKey: "productId",
    //   header: "Product ID",
    //   meta: {
    //     hidden: true,
    //   }
    // },
    {
      accessorKey: "productName",
      header: "Product Name",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "defectType",
      header: "Defect Type",
    },
    {
      accessorKey: "cameraId",
      header: "Camera ID",
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
    },
  ];
}
