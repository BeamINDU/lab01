"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronFirst, ChevronLast, Trash, Search, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { ColumnDef, useReactTable, getCoreRowModel, getSortedRowModel, SortingState, flexRender } from "@tanstack/react-table";


interface DataTableProps {
  columns: ColumnDef<any>[];
  data: any[];
  selectedIds: string[] | number[];
  defaultSorting: any[];
  // page: number;
  // setPage: (page: number) => void;
  // pageSize: number;
  // setPageSize: (pageSize: number) => void;
}

export default function DataTable({
  columns,
  data,
  selectedIds,
  defaultSorting
}: DataTableProps) {

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);

  // Sorting the entire dataset
  const sortedData = useMemo(() => {
    const sorted = [...data]; // Copy the original data to avoid mutation
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      sorted.sort((a, b) => {
        if (a[id] < b[id]) return desc ? 1 : -1;
        if (a[id] > b[id]) return desc ? -1 : 1;
        return 0;
      });
    }
    return sorted;
  }, [data, sorting]);

  // Paginated data after sorting
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, page, pageSize]);

  // Sorting functionality
  const handleSort = (columnId: string) => {
    if (columnId === "no") return;

    const isDesc = sorting[0]?.id === columnId && sorting[0]?.desc;
    setSorting([{ id: columnId, desc: !isDesc }]);
  };

  // Table setup with react-table
  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });



  return (
    <div>
      {/* Table Display */}
      <table className="border-collapse border border-gray-200 bg-white w-full text-sm">
        <thead className="bg-blue-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const widthClass =
                  header.id === "select"
                    ? "w-[60px] text-center"
                    : header.id === "actions"
                      ? "w-[100px] text-center"
                      : "";

                return (
                  <th
                    key={header.id}
                    className={`border border-gray-200 p-2 ${widthClass} `}
                  >
                    <div className={header.id === "select" ? "items-center" : "flex justify-between"}>
                      {/* Header rendering */}
                      {flexRender(header.column.columnDef.header, header.getContext())}

                      {/* Sort button */}
                      {header.id !== "select" &&
                        header.id !== "no" &&
                        header.id !== "actions" && (
                          <button
                            onClick={() => handleSort(header.id)}
                            className="ml-2 text-sm text-gray-600"
                          >
                            {sorting[0]?.id === header.id ? (
                              sorting[0]?.desc ? (
                                <ChevronDown size={15} className="text-red-900" />
                              ) : (
                                <ChevronUp size={15} className="text-red-900" />
                              )
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
          {table.getRowModel().rows.map((row, index) => (
            <tr key={row.id} className="border border-gray-200">
              {row.getVisibleCells().map((cell) => {
                const widthClass =
                  cell.column.id === "select"
                    ? "w-[60px] text-center"
                    : cell.column.id === "actions"
                    ? "w-[100px] text-center"
                    : "";

                return (
                  <td 
                    key={cell.id} 
                    className={`border border-gray-200 p-2 ${widthClass} `}
                  >
                    {cell.column.id === "no" ? (
                      (page - 1) * pageSize + index + 1
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-sm">
        <span className="mb-2 md:mb-0">
          Total Records: {data.length}
          <span className="mb-2 md:mb-0 ml-3">
            {selectedIds.length !== 0 && `(${selectedIds.length} row${selectedIds.length > 1 ? 's' : ''} selected)`}
          </span>
        </span>

        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <label>Rows per page:</label>
          <select
            className="border px-2 py-1 rounded"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

          {/* Pagination and Row Controls */}
          <button
            className={`w-8 h-8 flex justify-center items-center border rounded-full bg-gray-300 hover:bg-gray-200 ${(page === 1) ? "cursor-not-allowed" : ""}`}
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            <ChevronFirst size={16} />
          </button>
          <button
            className={`w-8 h-8 flex justify-center items-center border rounded-full bg-gray-300 hover:bg-gray-200 ${(page === 1) ? "cursor-not-allowed" : ""}`}
            onClick={() => setPage(Math.max(page - 1, 1))}
            disabled={page === 1}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="flex justify-center min-w-[90px]">
            {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, data.length)} of {data.length}
            {/* {page} / {pageSize} */}
          </span>
          <button
            className={`w-8 h-8 flex justify-center items-center border rounded-full bg-gray-300 hover:bg-gray-200 ${(page * pageSize >= data.length) ? "cursor-not-allowed" : ""}`}
            onClick={() => setPage(page + 1)}
            disabled={page * pageSize >= data.length}
          >
            <ChevronRight size={16} />
          </button>
          <button
            className={`w-8 h-8 flex justify-center items-center border rounded-full bg-gray-300 hover:bg-gray-200 ${(page * pageSize >= data.length) ? "cursor-not-allowed" : ""}`}
            onClick={() => setPage(Math.ceil(data.length / pageSize))}
            disabled={page * pageSize >= data.length}
          >
            <ChevronLast size={16} />
          </button>
        </div>
      </div>

    </div>
  );
}
