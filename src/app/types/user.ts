export type User = {
  id?: string
  userId: string
  username: string
  firstname: string
  lastname: string
  email: string
  roleName?: string
  status: boolean
  password?: string
  createdDate?: Date
  createdBy?: string
  updatedDate?: Date | null
  updatedBy?: string | null
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