export type Role = {
  roleId: string
  roleName: string
  description: string
  status: number,
  createdDate?: Date
  createdBy?: string
  updatedDate?: Date
  updatedBy?: string
  isCreateMode?: boolean
}

export type ParamSearch = {
  roleId?: string
  roleName?: string
  status?: number,
}