export type Product = {
  productId: string
  productName: string
  productType: string
  serialNo: string
  status: number,
  createdDate?: Date | null
  createdBy?: string
  updatedDate?: Date | null
  updatedBy?: string | null
  isCreateMode?: boolean
}

export type ParamSearch = {
  productId?: string
  productType?: string
  productName?: string
  serialNo?: string
  status?: number,
}