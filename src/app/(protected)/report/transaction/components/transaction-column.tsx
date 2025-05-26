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
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ getValue }) => {
        const rawValue = getValue() as string | number | Date | null | undefined;
        const formattedDate = formatDateTime(rawValue);
        return <div className="text-center">{formattedDate}</div>;
      },
      meta: {
        className: "w-[200px]",
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
      meta: {
        className: "w-[200px]",
      },
    },
    {
      accessorKey: "lotNo",
      header: "Lot No",
    },
    {
      accessorKey: "productId",
      header: "Product ID",
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
  ];
}
