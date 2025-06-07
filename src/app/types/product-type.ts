export type ProductType = {
  productTypeId: string
  productTypeName: string
  description: string
  status: boolean
  createdDate?: Date
  createdBy?: string
  updatedDate?: Date | null
  updatedBy?: string | null
  isCreateMode?: boolean
}

export type ParamSearch = {
  productTypeId?: string
  productTypeName?: string
  status?: boolean
}