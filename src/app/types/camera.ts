export type Camera = {
  id?: string
  cameraId: string
  cameraName: string
  location: string
  status: boolean
  statusName?: string
  createdDate?: Date
  createdBy?: string
  updatedDate?: Date | null
  updatedBy?: string | null
}

export type ParamSearch = {
  cameraId?: string
  cameraName?: string
  location?: string
  status?: boolean
}
