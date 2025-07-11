export type Transaction = {
  runningNo: number
  startDate: Date
  endDate: Date
  lotNo: string
  productId: string
  productName: string
  quantity: number
  createdDate?: Date
  createdBy?: string
  updatedDate?: Date | null
  updatedBy?: string | null
}

export type ParamSearch = {
  dateFrom?: Date
  dateTo?: Date
  lotNo?: string
  productId?: string
}