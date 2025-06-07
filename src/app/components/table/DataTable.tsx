"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronFirst, ChevronLast,  ChevronUp, ChevronDown } from "lucide-react";
import { ColumnDef, useReactTable, getCoreRowModel, getSortedRowModel, SortingState, flexRender } from "@tanstack/react-table";

interface DataTableProps {
  columns: ColumnDef<any>[];
  data: any[] | null;
  selectedIds: string[] | number[];
  defaultSorting: SortingState;
}

export default function DataTable({
  columns,
  data,
  selectedIds,
  defaultSorting,
}: DataTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);

  const safeData = useMemo(() => Array.isArray(data) ? data : [], [data]);

  // Do minimal sorting (first column only)
  const sortedData = useMemo(() => {
    if (sorting.length === 0) return safeData;

    const [{ id, desc }] = sorting;
    return [...safeData].sort((a, b) => {
      if (a[id] === b[id]) return 0;
      return desc
        ? a[id] < b[id] ? 1 : -1
        : a[id] > b[id] ? 1 : -1;
    });
  }, [safeData, sorting]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, page, pageSize]);

  const handleSort = (columnId: string) => {
    if (columnId === "no") return;
    const current = sorting[0];
    const isSame = current?.id === columnId;
    setSorting([{ id: columnId, desc: isSame ? !current.desc : false }]);
  };

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  const totalRows = safeData.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  const isFirstPage = page === 1;
  const isLastPage = page >= totalPages;
  
  return (
    <div>
      <table className="border-collapse border border-gray-200 bg-white w-full text-sm">
        <thead className="bg-blue-200">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const widthClass =
                  header.id === "select" ? "w-[60px] text-center" :
                  header.id === "actions" ? "w-[100px] text-center" : "";
                return (
                  <th key={header.id} className={`border border-gray-200 p-2 ${widthClass}`}>
                    <div className={header.id === "select" ? "items-center" : "flex justify-between"}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.id !== "select" && header.id !== "no" && header.id !== "actions" && (
                        <button onClick={() => handleSort(header.id)} className="ml-2 text-gray-600">
                          {sorting[0]?.id === header.id ? (
                            sorting[0].desc ? <ChevronDown size={15} /> : <ChevronUp size={15} />
                          ) : (
                            <ChevronUp size={15} className="text-gray-400" />
                          )}
                        </button>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 text-gray-500 border">
                No data available
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row, index) => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  const widthClass =
                    cell.column.id === "select" ? "w-[60px] text-center" :
                    cell.column.id === "actions" ? "w-[100px] text-center" : "";
                  return (
                    <td key={cell.id} className={`border p-2 ${widthClass}`}>
                      {cell.column.id === "no"
                        ? (page - 1) * pageSize + index + 1
                        : flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-sm">
        <span className="mb-2 md:mb-0">
          Total Records: {totalRows}
          {selectedIds.length > 0 && (
            <span className="ml-2">
              ({selectedIds.length} row{selectedIds.length > 1 ? "s" : ""} selected)
            </span>
          )}
        </span>

        <div className="flex items-center gap-2">
          <label>Rows per page:</label>
          <select
            className="border px-2 py-1 rounded"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          {/* Pagination Controls */}
          <button
            className={`w-8 h-8 flex justify-center items-center border rounded-full bg-gray-300 hover:bg-gray-200 ${ isFirstPage ? "cursor-not-allowed" : "" }`}
            onClick={() => setPage(1)}
            disabled={isFirstPage}
          >
            <ChevronFirst size={16} />
          </button>
          <button
            className={`w-8 h-8 flex justify-center items-center border rounded-full bg-gray-300 hover:bg-gray-200 ${ isFirstPage ? "cursor-not-allowed" : "" }`}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={isFirstPage}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="flex justify-center min-w-[90px]">
            {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, totalRows)} of {totalRows}
          </span>
          <button
            className={`w-8 h-8 flex justify-center items-center border rounded-full bg-gray-300 hover:bg-gray-200 ${ isLastPage ? "cursor-not-allowed" : "" }`}
            onClick={() => setPage(p => p + 1)}
            disabled={isLastPage}
          >
            <ChevronRight size={16} />
          </button>
          <button
            className={`w-8 h-8 flex justify-center items-center border rounded-full bg-gray-300 hover:bg-gray-200 ${ isLastPage ? "cursor-not-allowed" : "" }`}
            onClick={() => setPage(totalPages)}
            disabled={isLastPage}
          >
            <ChevronLast size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
