import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import { Product } from "@/app/types/product"
import { formatDateTime } from "@/app/utils/date";
import { Action } from '@/app/constants/menu';

interface ProductColumnProps {
  showCheckbox?: boolean;
  openEditModal: (row?: Product) => void;
  selectedIds: string[];
  setSelectedIds: (updater: (prevState: string[]) => string[]) => void; 
  data: Product[];
  canEdit: boolean
}

export default function productColumns({
  showCheckbox,
  openEditModal, 
  selectedIds,
  setSelectedIds,
  data,
  canEdit,
}: ProductColumnProps): ColumnDef<Product>[] {

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev: string[]) =>
      prev.length === data.length
        ? [] // If all items are selected, unselect all
        : data
          .map((item) => item.id) // Map to ids
          .filter((id): id is string => id !== undefined) // Filter out undefined values
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
                  checked={selectedIds.length === data.length && data.every(item => selectedIds.includes(item.id ?? ""))}
                  onChange={toggleSelectAll}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                />
              </div>
            ),
            cell: ({ row }) => (
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(row.original.id)} 
                  onChange={() => toggleSelect(row.original.id)} 
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
      accessorKey: "productId",
      header: "Product ID",
      meta: {
        style: { width: "7%" },
      },
    },
    {
      accessorKey: "productName",
      header: "Product Name",
    },
    {
      accessorKey: "productTypeId",
      header: "Product Type ID",
      meta: {
        style: { width: "8%" },
      },
    },
    {
      accessorKey: "productTypeName",
      header: "Product Type Name",
      meta: {
        style: { width: "8%" },
      },
    },
    {
      accessorKey: "serialNo",
      header: "Serial No",
    },
    {
      accessorKey: "barcode",
      header: "Barcode",
    },
    {
      accessorKey: "packSize",
      header: "Pack Size",
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
        style: { width: "5%" },
      },
    },    
    {
      accessorKey: "createdBy",
      header: "Created By",
      meta: {
        style: { width: "6%" },
      },
    },
    {
      accessorKey: "createdDate",
      header: "Created Date",
      cell: ({ getValue }) => {
        const rawValue = getValue() as string | number | Date | null | undefined;
        const formattedDate = formatDateTime(rawValue);
        return <div className="text-center">{formattedDate}</div>;
      },
      meta: {
        style: { width: "9%" },
      },
    },
    {
      accessorKey: "updatedBy",
      header: "Updated By",
      meta: {
        style: { width: "6%" },
      },
    },
    {
      accessorKey: "updatedDate",
      header: "Updated Date",
      cell: ({ getValue }) => {
        const rawValue = getValue() as string | number | Date | null | undefined;
        const formattedDate = formatDateTime(rawValue);
        return <div className="text-center">{formattedDate}</div>;
      },
      meta: {
        style: { width: "9%" },
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
