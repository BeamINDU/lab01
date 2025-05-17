export type  ReportDefect = {
  lotNo: string
  productType: string
  defectType: string
  total: number
  ok: number
  ng: number
}

export type ParamSearch = {
  lotNo: string
  productType: string
}