import { Role } from "@/app/types/role";

export type User = {
  id?: string
  userId: string
  username: string
  password?: string
  firstname: string
  lastname: string
  email: string
  status: boolean
  statusName?: string
  roleName?: string
  roles?: number[],
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