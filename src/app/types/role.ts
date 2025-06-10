export type Role = {
  id?: string
  roleId: string
  roleName: string
  description: string
  status: boolean,
  createdDate?: Date
  createdBy?: string
  updatedDate?: Date | null
  updatedBy?: string | null
}

export type ParamSearch = {
  roleId?: string
  roleName?: string
  status?: boolean,
}