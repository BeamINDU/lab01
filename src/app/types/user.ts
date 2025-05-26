export type User = {
  userId: string
  userName: string
  firstname: string
  lastname: string
  roleName?: string
  email: string
  status: number
  createdDate?: Date
  createdBy?: string
  updatedDate?: Date | null
  updatedBy?: string | null
  isCreateMode?: boolean
}

export type ParamSearch = {
  userId?: string
  userName?: string
  firstname?: string
  lastname?: string
  roleName?: string
  status?: number
}