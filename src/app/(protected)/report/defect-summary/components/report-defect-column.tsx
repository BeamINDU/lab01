import { ColumnDef } from "@tanstack/react-table";
import { ReportDefect } from "@/app/types/report-defect-summary"
import { formatNumber  } from "@/app/utils/format";

export default function ReportDefectColumns(): ColumnDef<ReportDefect>[] {
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
      accessorKey: "defectid",
      header: "Defect Type ID",
    },
    {
      accessorKey: "defecttype",
      header: "Defect Type Name",
    },
    {
      accessorKey: "totalprod",
      header: "Total",
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
      accessorKey: "totalok",
      header: "OK %",
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
      accessorKey: "totalng",
      header: "NG %",
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
