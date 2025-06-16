export type Role = {
  id?: number
  roleName: string
  description?: string
  status: boolean
  statusName?: string
  createdDate?: Date
  createdBy?: string
  updatedDate?: Date | null
  updatedBy?: string | null
}

export type ParamSearch = {
  roleName?: string
  status?: boolean,
}