export type ModelAssignment = {
  id?: number
  modelId?: number
  modelName?: string
  productId?: string
  cameraId?: string
  modelVersionId?:  number
  versionNo?: number
  status?: boolean
  statusName?: string
  appliedDate?: Date | null
  appliedBy?: string | null
}

export type ParamSearch = {
  modelName?: string
  productId?: string
  cameraId?: string
  versionNo?:  number
  status?: boolean
}