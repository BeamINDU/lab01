import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import { Planning } from "@/app/types/planning"
import { formatDateTime } from "@/app/utils/date";
import { formatNumber } from "@/app/utils/format";

interface PlanningColumnProps {
  showCheckbox?: boolean;
  openEditModal: (row?: Planning) => void;
  selectedIds: string[];
  setSelectedIds: (updater: (prevState: string[]) => string[]) => void; 
  data: Planning[];
  canEdit: boolean
}

export default function PlanningColumns({
  showCheckbox,
  openEditModal, 
  selectedIds,
  setSelectedIds,
  data,
  canEdit
}: PlanningColumnProps): ColumnDef<Planning>[] {

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
      accessorKey: "planId", 
      header: "Plan ID",
    },
    {
      accessorKey: "productId",
      header: "Products ID",
    },
    {
      accessorKey: "lotNo",
      header: "Lot No",
    },
    {
      accessorKey: "lineId",
      header: "Line ID",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ getValue }) => {
        const value = getValue<number>();
        return (
          <div className="text-right">
            {formatNumber(value)}
          </div>
        );
      },
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ getValue }) => {
        const rawValue = getValue() as string | number | Date | null | undefined;
        const formattedDate = formatDateTime(rawValue);
        return <div className="text-center">{formattedDate}</div>;
      },
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ getValue }) => {
        const rawValue = getValue() as string | number | Date | null | undefined;
        const formattedDate = formatDateTime(rawValue);
        return <div className="text-center">{formattedDate}</div>;
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
    // {
    //   accessorKey: "updatedBy",
    //   header: "Updated By",
    // },
    // {
    //   accessorKey: "updatedDate",
    //   header: "Updated Date",
    //   cell: ({ getValue }) => {
    //     const rawValue = getValue() as string | number | Date | null | undefined;
    //     const formattedDate = formatDateTime(rawValue);
    //     return <div className="text-center">{formattedDate}</div>;
    //   },
    // },
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
