export type DefectType = {
  defectTypeId: string
  defectTypeName: string
  description: string
  createdDate?: Date
  createdBy?: string
  updatedDate?: Date | null
  updatedBy?: string | null
  isCreateMode?: boolean
}

export type ParamSearch = {
  defectTypeId?: string
  defectTypeName?: string
}