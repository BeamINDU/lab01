import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "@/app/types/transaction"
import { formatNumber } from "@/app/utils/format";
import { formatDateTime } from "@/app/utils/date";

export default function ReportDefectColumns(): ColumnDef<Transaction>[] {
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
      accessorKey: "actualstartdatetime",
      header: "Start Date",
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
      accessorKey: "actualenddatetime",
      header: "End Date",
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
      accessorKey: "prodlot",
      header: "Lot No",
    },
    {
      accessorKey: "prodid",
      header: "Product ID",
    },
    {
      accessorKey: "prodname",
      header: "Product Name",
    },
    {
      accessorKey: "quantity",
      header: "Actual Total Quantity",
      cell: ({ getValue }) => {
        const value = getValue<number>();
        return (
          <div className="text-right">
            {formatNumber(value)}
          </div>
        );
      },
      meta: {
        style: { width: "12%" },
      },
    },
  ];
}
