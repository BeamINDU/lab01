export type Product = {
  id?: string
  productId: string
  productName: string
  productTypeId: string
  productTypeName?: string
  serialNo: string
  barcode: string
  packSize: number
  status: boolean
  statusName?: string
  createdDate?: Date
  createdBy?: string
  updatedDate?: Date | null
  updatedBy?: string | null
}

export type ParamSearch = {
  productId?: string
  productName?: string
  productTypeId?: string
  serialNo?: string | undefined
  status?: boolean,
}