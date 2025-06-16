export type ProductType = {
  id?: string
  productTypeId: string
  productTypeName: string
  description: string
  status: boolean
  statusName?: string
  createdDate?: Date
  createdBy?: string
  updatedDate?: Date | null
  updatedBy?: string | null
}

export type ParamSearch = {
  productTypeId?: string
  productTypeName?: string
  status?: boolean
}