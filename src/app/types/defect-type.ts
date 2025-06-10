export type DefectType = {
  id?: string
  defectTypeId: string
  defectTypeName: string
  description: string
  status: boolean
  createdDate?: Date
  createdBy?: string
  updatedDate?: Date | null
  updatedBy?: string | null
}

export type ParamSearch = {
  defectTypeId?: string
  defectTypeName?: string
  status?: boolean
}