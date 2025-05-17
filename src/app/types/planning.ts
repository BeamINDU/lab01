export type Planning = {
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
  dateFrom?: Date,
  dateTo?: Date,
  productId?: string,
  lotNo?: string,
  lineId?: number,
}