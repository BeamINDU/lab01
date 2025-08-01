'use client'

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { exportExcel, exportCSV } from "@/app/libs/export";
import { ExportType } from '@/app/constants/export-type';
import { Transaction, ParamSearch } from "@/app/types/transaction"
import { search, download } from "@/app/libs/services/transaction";
import { usePermission } from '@/app/contexts/permission-context';
import { Menu, Action } from '@/app/constants/menu';
import { extractErrorMessage } from '@/app/utils/errorHandler';
import { formatDateTime } from "@/app/utils/date";
import ExportButton from "@/app/components/common/ExportButton";
import DataTable from "@/app/components/table/DataTable2";
import TransactionColumns from "./components/transaction-column";
import TransactionFilterForm from './components/transaction-filter';

export default function Page() {
  const { hasPermission } = usePermission();
  const { register, getValues, setValue, reset, control } = useForm(); 
  const [data, setData] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }>({ id: 'actualstartdatetime', desc: true });

  const buildSearchParams = (
    override?: Partial<{ page: number; pageSize: number; sorting: { id: string; desc: boolean } }>
  ): ParamSearch => {
    const values = getValues();
    return {
      dateFrom: values.dateFrom || '',
      dateTo: values.dateTo || '',
      lotNo: values.lotNo || '',
      productId: values.productId || '',
      productName: values.productName || '',
      page: override?.page ?? page,
      pageSize: override?.pageSize ?? pageSize,
      order_by: override?.sorting?.id ?? sorting.id,
      order_dir: (override?.sorting?.desc ?? sorting.desc) ? 'desc' : 'asc',
    };
  };

  const fetchData = useCallback( async (
    override?: Partial<{ page: number; pageSize: number; sorting: { id: string; desc: boolean } }>
  ) => {
    try {
      const newPage = override?.page ?? page;
      const newPageSize = override?.pageSize ?? pageSize;
      const newSorting = override?.sorting ?? sorting;

      const params = buildSearchParams(override);
      const result = await search(params);
      setData(result.items || []);
      setTotal(result.total || 0);
      setPage(newPage);
      setPageSize(newPageSize);
      setSorting(newSorting);
    } catch (error) {
      console.error('Search failed:', error);
      showError('Search failed');
      setData([]);
    }
  }, [getValues, page, pageSize, sorting]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = () => {
    setPage(1);
    fetchData({page: 1})
  };

  const handleChangePage = ({ page: newPage = page, pageSize: newPageSize = pageSize, sorting: newSorting = sorting }) => {
    setPage(newPage);
    setPageSize(newPageSize);
    setSorting(newSorting);
    fetchData({ page: newPage, pageSize: newPageSize, sorting: newSorting }); 
  };

  const handleExport = (type: ExportType) => {
    try {
      const headers = ["Start Date", "End Date", "Lot ID", "Product Id", "Product Name", "Actual Total Quantity"];
      const keys: (keyof Transaction)[] = ["actualstartdatetime", "actualenddatetime", "prodlot", "prodid", "prodname", "quantity"];
      const fileName = `Transaction_${formatDateTime(new Date(), 'yyyyMMdd_HHmmss')}`;
    
      switch (type) {
        case ExportType.CSV:
          exportCSV(data, headers, keys, fileName);
          break;
        case ExportType.Excel:
          exportExcel(data, headers, keys, fileName);
          break;
      }
    } catch (error) {
      console.error("Export operation failed:", error);
      showError(`Export failed: ${extractErrorMessage(error)}`);
    }
  };

  const handleDownload = async (type: ExportType) => {
    try {
      const params = { ...buildSearchParams(), exportType: type };
      const response = await download(params);
      const blob = response as Blob;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url
      a.download = `Transaction_${formatDateTime(new Date(), 'yyyyMMdd_HHmmss')}.${type === ExportType.Excel ? 'xlsx' : 'csv'}`;
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export operation failed:", error);
      showError(`Export failed: ${extractErrorMessage(error)}`);
    }
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-2 ml-3">Transaction</h2>
      <div className="p-4 mx-auto">
      <div className="mb-4 max-w-full text-sm">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Form */}
            <div className="md:basis-[80%]">
              <TransactionFilterForm 
                register={register} 
                control={control}
                setValue={setValue}
                onSearch={handleSearch} 
              />
            </div>
            
            <div className="md:basis-[20%] flex flex-col justify-end items-end gap-2">
              <div className="flex flex-wrap justify-end gap-2 mr-2 ">
                {/* Export Button */}
                {hasPermission(Menu.ReportTransaction, Action.Export) && (
                  <ExportButton onExport={handleDownload} />
                )}
              </div>
              
            </div>
          </div>
        </div>

        {/* DataTable */}
        <DataTable
          columns={TransactionColumns()}
          data={data}
          total={total}
          page={page}
          pageSize={pageSize}
          sorting={[sorting]}
          onChangePage={(p) => handleChangePage({ page: p })}
          onChangePageSize={(s) => handleChangePage({ page: 1, pageSize: s })}
          onSortingChange={(updater) => {
            const nextSorting = typeof updater === 'function' ? updater([sorting]) : updater;
            const sort = nextSorting[0] ?? { id: 'actualstartdatetime', desc: false };
            handleChangePage({ page: 1, sorting: sort });
          }}
        />

      </div>
    </>
  )
}