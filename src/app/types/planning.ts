// src/app/types/planning.ts
export type Planning = {
  planId: string,
  productId: string,
  lotNo: string,
  lineId: string,
  // กำหนดให้ยอมรับได้ทั้ง Date, string หรือ number
  startDate: Date | string | number,
  endDate: Date | string | number,
  createdDate?: Date | string,
  createdBy?: string,
  updatedDate?: Date | string,
  updatedBy?: string,
  isCreateMode?: boolean
}

export type ParamSearch = {
  planId?: string,
  dateFrom?: Date | string,
  dateTo?: Date | string,
  productId?: string,
  lotNo?: string,
  lineId?: string,
}