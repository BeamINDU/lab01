export type ReportProduct = {
  datetime: Date
  productId: string
  productName: string
  lotNo: string
  status: string
  defectType: string
  cameraId: string
}

export type ProductDetail = {
  productId: string
  productName: string
  serialNo: string
  date: string
  time: string
  lotNo: string
  defectType: string
  cameraId: string
  history: History[]
  status: string
  comment: string
}

export type History = {
  date: string, 
  time: string, 
  updatedBy: string
}

export type ParamSearch = {
  dateFrom?: Date
  dateTo?: Date
  productName?: string
  defectType?: string
  cameraId?: string
  status?: string
}

export type ParamUpdate = {
  productId: string
  status: string
  comment?: string,
  updatedBy?: string
}

