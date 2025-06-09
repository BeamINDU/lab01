import { ColumnDef } from "@tanstack/react-table";
import { ReportDefect } from "@/app/types/report-defect-summary"
import { formatNumber  } from "@/app/utils/format";

export default function ReportDefectColumns(): ColumnDef<ReportDefect>[] {
  return [
    {
      accessorKey: "no",
      header: "No",
      enableSorting: false,
    },
    {
      accessorKey: "lotNo",
      header: "Lot No",
    },
    {
      accessorKey: "productTypeName",
      header: "Product Type Name",
    },
    {
      accessorKey: "defectTypeName",
      header: "Defect Type Name",
    },
    {
      accessorKey: "total",
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
      accessorKey: "ok",
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
      accessorKey: "ng",
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
