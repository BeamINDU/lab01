import { ExportType } from '@/app/constants/export-type';

export type Planning = {
  id?: string,
  planid: string,
  prodid: string,
  prodname?: string,
  prodlot: string,
  prodline: string,
  quantity: number,
  startdatetime: Date | null,
  enddatetime: Date | null,
  actualstartdatetime?: Date | null,
  actualenddatetime?: Date | null,
  createddate?: Date
  createdby?: string
  updateddate?: Date | null
  updatedby?: string | null
  seq_no?: number
}

export type ParamSearch = {
  planId?: string,
  dateFrom?: Date | string,
  dateTo?: Date | string,
  productId?: string,
  productName?: string,
  lotNo?: string,
  lineId?: string,
  page?: number
  pageSize?: number
  order_by?: string
  order_dir?: string
  exportType?: ExportType
}

