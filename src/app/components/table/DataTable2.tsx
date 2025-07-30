"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronFirst, ChevronLast, ChevronUp, ChevronDown,} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
  ColumnMeta,
  flexRender,
  Row,
  SortingState,
  Updater,
  OnChangeFn,
} from "@tanstack/react-table";
import { formatNumber } from "@/app/utils/format";

interface MyColumnMeta<TData> extends ColumnMeta<TData, unknown> {
  style?: React.CSSProperties;
}

type MyColumnDef<TData> = ColumnDef<TData> & {
  meta?: MyColumnMeta<TData>;
};

interface DataTableProps<TData> {
  columns: MyColumnDef<TData>[];
  data: TData[];
  total: number;
  page: number;
  pageSize: number;
  selectedIds?: (string | number)[];
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  onChangePage: (p: number) => void;
  onChangePageSize: (size: number) => void;
}

export default function DataTable<TData>({
  columns,
  data,
  total,
  page,
  pageSize,
  selectedIds = [],
  sorting,
  onSortingChange,
  onChangePage,
  onChangePageSize,
}: DataTableProps<TData>) {
  const isFirstPage = page === 1;
  const totalPages = Math.ceil(total / pageSize);
  const isLastPage = page >= totalPages;

  const handleSortClick = (columnName: string) => {
    if (columnName === "no") return;

    onSortingChange((old) => {
      const current = old?.[0];
      const isSame = current?.id === columnName;

      return [{ id: columnName, desc: isSame ? !current.desc : false }];
    });
  };

  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange,
    manualSorting: true,
  });

  return (
    <div>
      <table className="border-collapse border border-gray-200 bg-white w-full text-sm">
        <thead className="bg-blue-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const style = (header.column.columnDef.meta as MyColumnMeta<TData> | undefined)?.style;

                return (
                  <th key={header.id} className="border border-gray-200 p-2" style={style}>
                    <div
                      className={
                        header.id === "select" ? "items-center" : "flex justify-between"
                      }
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.id !== "select" &&
                        header.id !== "no" &&
                        header.id !== "actions" && (
                          <button
                            onClick={() => handleSortClick(header.id)}
                            className="ml-2 text-gray-600"
                          >
                            {sorting[0]?.id === header.id ? (
                              sorting[0].desc ? (
                                <ChevronDown size={15} />
                              ) : (
                                <ChevronUp size={15} />
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
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-3 text-gray-500 border">
                No data available
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row: Row<TData>, index) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const style = (cell.column.columnDef.meta as MyColumnMeta<TData> | undefined)?.style;

                  return (
                    <td key={cell.id} className="border p-2" style={style}>
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
          Total Records: {formatNumber(total)}
          {selectedIds?.length > 0 && (
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
              onChangePageSize(Number(e.target.value));
              onChangePage(1);
            }}
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <button
            className={`w-8 h-8 flex justify-center items-center border rounded-full bg-gray-300 hover:bg-gray-200 ${
              isFirstPage ? "cursor-not-allowed" : ""
            }`}
            onClick={() => onChangePage(1)}
            disabled={isFirstPage}
          >
            <ChevronFirst size={16} />
          </button>
          <button
            className={`w-8 h-8 flex justify-center items-center border rounded-full bg-gray-300 hover:bg-gray-200 ${
              isFirstPage ? "cursor-not-allowed" : ""
            }`}
            onClick={() => onChangePage(page - 1)}
            disabled={isFirstPage}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="flex justify-center min-w-[90px]">
            {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of{" "}
            {formatNumber(total)}
          </span>
          <button
            className={`w-8 h-8 flex justify-center items-center border rounded-full bg-gray-300 hover:bg-gray-200 ${
              isLastPage ? "cursor-not-allowed" : ""
            }`}
            onClick={() => onChangePage(page + 1)}
            disabled={isLastPage}
          >
            <ChevronRight size={16} />
          </button>
          <button
            className={`w-8 h-8 flex justify-center items-center border rounded-full bg-gray-300 hover:bg-gray-200 ${
              isLastPage ? "cursor-not-allowed" : ""
            }`}
            onClick={() => onChangePage(totalPages)}
            disabled={isLastPage}
          >
            <ChevronLast size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
