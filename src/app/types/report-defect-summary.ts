export type  ReportDefect = {
  runningNo: string,
  lotNo: string
  productId: string
  productName: string
  defectTypeId: string
  defectTypeName: string
  total: number
  ok: number
  ng: number
}

export type ParamSearch = {
  lotNo?: string
  productId?: string
  defectTypeId?: string
  // productName?: string
  // defectTypeName?: string
}