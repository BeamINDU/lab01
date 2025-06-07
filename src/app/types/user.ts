export type User = {
  userId: string
  username: string
  password: string
  firstname: string
  lastname: string
  email: string
  roleName?: string
  status: boolean
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
  roleId?: string
  status?: boolean
}