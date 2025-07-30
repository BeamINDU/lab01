export type ModelAssignment = {
  id?: number
  modelId?: number
  modelName?: string
  modelVersionId?:  number
  versionNo?: number
  productId?: string
  productName?: string
  cameraId?: string
  cameraName?: string
  status?: boolean
  statusName?: string
  appliedDate?: Date | null
  appliedBy?: string | null
}

export type ParamSearch = {
  modelName?: string
  productId?: string
  productName?: string
  cameraId?: string
  cameraName?: string
  versionNo?:  number
  status?: boolean
}