'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { exportText, exportExcel, exportWord, exportCSV } from "@/app/lib/export";
import { ExportType } from '@/app/lib/constants/export-type';
import { Transaction, ParamSearch } from "@/app/types/transaction"
import { search, detail } from "@/app/lib/services/transaction";
import { usePermission } from '@/app/contexts/permission-context';
import { Menu, Action } from '@/app/lib/constants/menu';
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
      const products = await search(param);
      setData(products);
    } catch (error) {
      console.error("Search operation failed:", error);
      showError('Search failed');
      setData([]);
    }
  };

  const handleExport = (type: ExportType) => {
    const headers = ["Lot ID", "Product Name", "Quantity"];
    const keys: (keyof Transaction)[] = ["lotNo","productId", "quantity"];
    const fileName = "Transaction";
  
    switch (type) {
      case ExportType.CSV:
        exportCSV(data, headers, keys, fileName);
        break;
      case ExportType.Excel:
        exportExcel(data, headers, keys, fileName);
        break;
    }
  };


  return (
    <>
      <h2 className="text-2xl font-bold mb-2 ml-3">Transaction</h2>
      <div className="p-4 mx-auto">
      <div className="mb-6 max-w-full text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Filters Form */}
            <TransactionFilterForm 
              register={register} 
              control={control}
              onSearch={handleSearch} 
            />
            
            <div className="md:col-span-1 flex flex-col justify-end items-end gap-4">
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
          selectedIds={selectedIds}
          defaultSorting={[{ id: "lotNo", desc: false }]}
        />

      </div>
    </>
  )
}