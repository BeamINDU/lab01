import { ExportType } from '@/app/constants/export-type';

export type Transaction = {
  runningno: number
  actualstartdatetime: Date
  actualenddatetime: Date
  prodlot: string
  prodid: string
  prodname: string
  quantity: number 
}

export type ParamSearch = {
  dateFrom?: Date
  dateTo?: Date
  lotNo?: string
  productId?: string
  productName?: string
  page?: number
  pageSize?: number
  order_by?: string
  order_dir?: string
  exportType?: ExportType
}