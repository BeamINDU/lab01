export type Product = {
  productId: string
  productName: string
  productType: string
  serialNo: string
  status: number,
  createdDate?: Date
  createdBy?: string
  updatedDate?: Date
  updatedBy?: string
  isCreateMode?: boolean
}

export type ParamSearch = {
  productId?: string
  productType?: string
  productName?: string
  serialNo?: string
  status?: number,
}