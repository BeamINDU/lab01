import { ColumnDef } from "@tanstack/react-table";
import { SquarePen, Square, Play } from "lucide-react";
import { Planning } from "@/app/types/planning"
import { formatDateTime } from "@/app/utils/date";
import { formatNumber } from "@/app/utils/format";

interface PlanningColumnProps {
  showCheckbox?: boolean;
  openEditModal: (row?: Planning) => void;
  onStartPlan: (row: Planning) => Promise<void>;
  onStopPlan: (row: Planning) => Promise<void>;
  selectedIds: string[];
  setSelectedIds: (updater: (prevState: string[]) => string[]) => void;
  data: Planning[];
  canEdit: boolean;
}

export default function PlanningColumns({
  showCheckbox,
  openEditModal,
  onStartPlan,
  onStopPlan,
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
              width: '2%',
            },
          },
        }
      ]
      : []),
    {
      accessorKey: "no",
      header: "No",
      enableSorting: false,
      meta: {
        style: { width: "2%" },
      },
    },
    {
      accessorKey: "planid",
      header: "Plan ID",
      meta: {
        style: { width: "4%" },
      },
    },
    {
      accessorKey: "startdatetime",
      header: "Plan Startdate",
      cell: ({ getValue }) => {
        const rawValue = getValue() as string | number | Date | null | undefined;
        const formattedDate = formatDateTime(rawValue);
        return <div className="text-center">{formattedDate}</div>;
      },
      meta: {
        style: { width: "7%" },
      },
    },
    {
      accessorKey: "enddatetime",
      header: "Plan Enddate",
      cell: ({ getValue }) => {
        const rawValue = getValue() as string | number | Date | null | undefined;
        const formattedDate = formatDateTime(rawValue);
        return <div className="text-center">{formattedDate}</div>;
      },
      meta: {
        style: { width: "7%" },
      },
    },
    {
      accessorKey: "actualstartdatetime",
      header: "Actual Startdate",
      cell: ({ getValue }) => {
        const rawValue = getValue() as string | number | Date | null | undefined;
        const formattedDate = formatDateTime(rawValue);
        return <div className="text-center">{formattedDate}</div>;
      },
      meta: {
        style: { width: "7%" },
      },
    },
    {
      accessorKey: "actualenddatetime",
      header: "Actual Enddate",
      cell: ({ getValue }) => {
        const rawValue = getValue() as string | number | Date | null | undefined;
        const formattedDate = formatDateTime(rawValue);
        return <div className="text-center">{formattedDate}</div>;
      },
      meta: {
        style: { width: "7%" },
      },
    },
    {
      accessorKey: "prodid",
      header: "Products ID",
      meta: {
        style: { width: "5%" },
      },
    },
    {
      accessorKey: "prodname",
      header: "Products Name",
      meta: {
        style: { width: "7%" },
      },
    },
    {
      accessorKey: "prodlot",
      header: "Lot No",
      meta: {
        style: { width: "4%" },
      },
    },
    {
      accessorKey: "prodline",
      header: "Line ID",
      meta: {
        style: { width: "6%" },
      },
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
      meta: {
        style: { width: "4%" },
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          {/* Start Button */}
          <button
            className={`px-2 py-2 flex items-center justify-center rounded-full transition
              ${row.original.actualstartdatetime
                ? "text-white bg-green-600 "
                : "text-green-600 bg-green-100 hover:bg-green-200"}`}
            onClick={() => onStartPlan(row.original)}
            title="Start Plan"
          >
            <Play size={12} />
          </button>

          {/* Stop Button */}
          <button
            className={`px-2 py-2 flex items-center justify-center rounded-full transition disabled:cursor-not-allowed
              ${row.original.actualenddatetime
                ? "text-white bg-red-600"
                : "text-red-600 bg-red-100 hover:bg-red-200"}`}
            onClick={() => onStopPlan(row.original)}
            title="Stop Plan"
            disabled={row.original.actualstartdatetime === null}
          >
            <Square size={12} />
          </button>

          {/* Edit / Detail Button */}
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
