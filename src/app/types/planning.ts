export type Planning = {
  planId: string,
  productId: string,
  lotNo: string,
  lineId: string,
  startDate: Date,
  endDate: Date,
  createdDate?: Date,
  createdBy?: string,
  updatedDate?: Date,
  updatedBy?: string,
  isCreateMode?: boolean
}

export type ParamSearch = {
  planId?: string,
  dateFrom?: Date,
  dateTo?: Date,
  productId?: string,
  lotNo?: string,
  lineId?: string,
}