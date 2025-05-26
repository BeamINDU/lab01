export type Camera = {
  cameraId: string
  cameraName: string
  location: string
  status: number
  createdDate?: Date
  createdBy?: string
  updatedDate?: Date | null
  updatedBy?: string | null
  isCreateMode?: boolean
}

export type ParamSearch = {
  cameraId?: string
  cameraName?: string
  location?: string
  status?: string
}
