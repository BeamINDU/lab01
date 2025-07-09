'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { exportExcel, exportCSV } from "@/app/libs/export";
import { ExportType } from '@/app/constants/export-type';
import { Transaction, ParamSearch } from "@/app/types/transaction"
import { search } from "@/app/libs/services/transaction";
import { usePermission } from '@/app/contexts/permission-context';
import { Menu, Action } from '@/app/constants/menu';
import { extractErrorMessage } from '@/app/utils/errorHandler';
import { formatDateTime } from "@/app/utils/date";
import ExportButton from "@/app/components/common/ExportButton";
import DataTable from "@/app/components/table/DataTable";
import TransactionColumns from "./components/transaction-column";
import TransactionFilterForm from './components/transaction-filter';

export default function Page() {
  const { hasPermission } = usePermission();
  const { register, getValues, setValue, reset, control } = useForm(); 
  const [data, setData] = useState<Transaction[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      const formValues = getValues();
      const param: ParamSearch = {
        dateFrom: formValues.dateFrom || '',
        dateTo: formValues.dateTo || '',
        lotNo: formValues.lotNo || '',
        productId: formValues.productId || '',
      };
      const transactions = await search(param);
      setData(Array.isArray(transactions) ? transactions : []);
    } catch (error) {
      console.error("Search operation failed:", error);
      showError('Search failed');
      setData([]);
    }
  };

  const handleExport = (type: ExportType) => {
    try {
      const headers = ["Start Date", "End Date", "Lot ID", "Product Id", "Actual Total Quantity"];
      const keys: (keyof Transaction)[] = ["startDate", "endDate", "lotNo", "productId", "quantity"];
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


  return (
    <>
      <h2 className="text-2xl font-bold mb-2 ml-3">Transaction</h2>
      <div className="p-4 mx-auto">
      <div className="mb-6 max-w-full text-sm">
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
            
            <div className="md:basis-[20%] flex flex-col justify-end items-end gap-4">
              <div className="flex flex-wrap justify-end gap-2 mr-2 ">
                {/* Export Button */}
                {hasPermission(Menu.ReportTransaction, Action.Export) && (
                  <ExportButton onExport={handleExport} />
                )}
              </div>
              
            </div>
          </div>
        </div>

        {/* DataTable */}
        <DataTable
          columns={TransactionColumns()}
          data={data}
          defaultSorting={[{ id: "lotNo", desc: false }]}
        />

      </div>
    </>
  )
}