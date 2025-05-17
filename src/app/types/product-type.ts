export type ProductType = {
  productTypeId: string
  productTypeName: string
  description: string
  status: number
  createdDate?: Date
  createdBy?: string
  updatedDate?: Date
  updatedBy?: string
  isCreateMode?: boolean
}

export type ParamSearch = {
  productTypeId?: string
  productTypeName?: string
  status?: string
}