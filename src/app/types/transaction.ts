export type Transaction = {
  runningNo: number
  startDate: Date
  endDate: Date
  lotNo: string
  productId: string
  quantity: number
  createdDate?: Date
  createdBy?: string
  updatedDate?: Date
  updatedBy?: string
}

export type ParamSearch = {
  dateFrom?: Date
  dateTo?: Date
  lotNo?: string
  productId?: string
}