import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import { Product } from "@/app/types/product"
import { formatDateTime } from "@/app/utils/date";
import { Action } from '@/app/lib/constants/menu';

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
      accessorKey: "productId",
      header: "Product ID",
    },
    {
      accessorKey: "productName",
      header: "Production Name",
    },
    {
      accessorKey: "productType",
      header: "Production Type",
    },
    // {
    //   accessorKey: "lotNo",
    //   header: "Lot No",
    // },
    {
      accessorKey: "serialNo",
      header: "Serial No",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const value = getValue() as number;
        const isActive = value === 1;
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
