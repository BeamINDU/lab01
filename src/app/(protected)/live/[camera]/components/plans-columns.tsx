import { ColumnDef } from "@tanstack/react-table";
import { Planning } from "@/app/types/planning"
import { formatNumber } from "@/app/utils/format";
import { formatDateTime } from "@/app/utils/date";

export default function PlansColumns(): ColumnDef<Planning>[] {
  return [
    {
      accessorKey: "no",
      header: "No",
      enableSorting: false,
      meta: {
        style: { width: "5%" },
      },
    },
     {
      accessorKey: "productId",
      header: "Product ID",
      meta: {
        style: { width: "15%" },
      },
    },
    {
      accessorKey: "lotNo",
      header: "Lot No",
      meta: {
        style: { width: "15%" },
      },
    },
    {
      accessorKey: "lineId",
      header: "Line No",
      meta: {
        style: { width: "10%" },
      },
    },
    {
      accessorKey: "startDate",
      header: "Start Datetime",
      cell: ({ getValue }) => {
        const rawValue = getValue() as string | number | Date | null | undefined;
        const formattedDate = formatDateTime(rawValue);
        return <div className="text-center">{formattedDate}</div>;
      },
      meta: {
        style: { width: "20%" },
      },
    },
    {
      accessorKey: "endDate",
      header: "End DateTime",
      cell: ({ getValue }) => {
        const rawValue = getValue() as string | number | Date | null | undefined;
        const formattedDate = formatDateTime(rawValue);
        return <div className="text-center">{formattedDate}</div>;
      },
      meta: {
        style: { width: "20%" },
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
        style: { width: "15%" },
      },
    },
  ];
}
