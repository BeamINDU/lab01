export type Planning = {
  id?: string,
  planId: string,
  productId: string,
  lotNo: string,
  lineId: string,
  quantity: number,
  startDate: Date | string | number,
  endDate: Date | string | number,
  createdDate?: Date | string,
  createdBy?: string,
  updatedDate?: Date | string,
  updatedBy?: string | null,
}

export type ParamSearch = {
  planId?: string,
  dateFrom?: Date | string,
  dateTo?: Date | string,
  productId?: string,
  lotNo?: string,
  lineId?: string,
}

