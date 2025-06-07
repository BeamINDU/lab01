export type ReportProduct = {
  runningNo: string,
  datetime: Date
  productId: string
  productName: string
  status: string
  defectTypeId: string
  defectTypeName: string
  cameraName: string
  imageUrl: string
}

export type ProductDetail = {
  productId: string
  productName: string
  serialNo: string
  date: string
  time: string
  lotNo: string
  defectTypeId: string
  defectTypeName: string
  cameraId: string
  cameraName: string
  history: History[]
  status: string
  comment: string
  imageUrl: string
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
  cameraName?: string
  status?: string
}

export type ParamUpdate = {
  productId?: string
  status?: string
  comment?: string,
  updatedBy?: string
}

