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
        style: { width: "4%" },
      },
    },
    {
      accessorKey: "planid",
      header: "Plan ID",
      meta: {
        style: { width: "10%" },
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
        style: { width: "14%" },
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
        style: { width: "14%" },
      },
    },
    {
      accessorKey: "prodid",
      header: "Product ID",
      meta: {
        style: { width: "13%" },
      },
    },
    {
      accessorKey: "prodname",
      header: "Product Name",
      meta: {
        style: { width: "16%" },
      },
    },
    {
      accessorKey: "prodlot",
      header: "Lot No",
      meta: {
        style: { width: "10%" },
      },
    },
    {
      accessorKey: "prodline",
      header: "Line No",
      meta: {
        style: { width: "10%" },
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
        style: { width: "9%" },
      },
    },
  ];
}
