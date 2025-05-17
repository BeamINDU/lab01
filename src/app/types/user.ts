export type User = {
  userId: string
  userName: string
  fullName: string
  roleName?: string
  status: number
  createdDate?: Date
  createdBy?: string
  updatedDate?: Date
  updatedBy?: string
  isCreateMode?: boolean
}

export type ParamSearch = {
  userId?: string
  userName?: string
  fullName?: string
  roleName?: string
  status?: number
}