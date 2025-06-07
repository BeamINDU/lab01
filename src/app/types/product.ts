export type Product = {
  productId: string
  productName: string
  productTypeId: string
  productTypeName?: string
  serialNo: string
  status: boolean
  createdDate?: Date | null
  createdBy?: string
  updatedDate?: Date | null
  updatedBy?: string | null
  isCreateMode?: boolean
}

export type ParamSearch = {
  productId?: string
  productName?: string
  productTypeName?: string
  serialNo?: string | undefined
  status?: boolean,
}