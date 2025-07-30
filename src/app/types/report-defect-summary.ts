export type  ReportDefect = {
  summaryid: string,
  prodlot: string
  prodid: string
  prodname: string
  defectid: string
  defecttype: string
  totalprod: number
  totalok: number
  totalng: number
}

export type ParamSearch = {
  lotNo?: string
  productId?: string
  productName?: string
  defectTypeId?: string
  defectTypeName?: string
  page?: number
  pageSize?: number
  order_by?: string
  order_dir?: string
}