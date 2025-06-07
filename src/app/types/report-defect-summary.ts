export type  ReportDefect = {
  runningNo: string,
  lotNo: string
  productTypeId: string
  productTypeName: string
  defectTypeId: string
  defectTypeName: string
  total: number
  ok: number
  ng: number
}

export type ParamSearch = {
  lotNo?: string
  productTypeName?: string
  defectTypeName?: string
}