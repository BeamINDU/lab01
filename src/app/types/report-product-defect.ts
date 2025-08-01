import { ExportType } from '@/app/constants/export-type';

export type ReportProduct = {
  runningno: number
  defecttime: Date
  prodid: string
  prodname: string
  prodseq: number
  prodstatus: string
  defectdetail: string
  cameraid: string
  cameraname?: string
  imagepath: string
}

export type ProductDetail = {
  id: number
  defecttime: Date
  productId: string
  productName: string
  sequence: number
  serialNo: string
  defectDetail: string
  cameraId: string
  cameraName?: string
  imagePath: string
  history: History[]
  status: string
  comment: string
  actionBy?: string
  image64?: string
}

export type History = {
  actiondate: string, 
  status: string, 
  comment: string, 
  actionby: string
}

export type ParamSearch = {
  dateFrom?: Date
  dateTo?: Date
  productId?: string
  productName?: string
  // defectTypeId?: string
  defectTypeName?: string
  cameraId?: string
  cameraName?: string
  status?: string
  page?: number
  pageSize?: number
  order_by?: string
  order_dir?: string
  exportType?: ExportType
}

export type ParamDetail = {
  id: number
  datetime: string
  productId: string
  sequence: number
  cameraId: string
  imagePath: string
}

export type ParamUpdate = {
  id: number
  datetime: string
  productId: string
  sequence: number
  cameraId: string
  imagePath: string
  status: string
  comment?: string,
  updatedBy?: string
}

