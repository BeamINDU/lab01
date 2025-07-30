import { Role } from "@/app/types/role";

export type User = {
  id?: string
  userId: string
  username: string
  password?: string
  firstname: string
  lastname: string
  fullname?: string
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
  username?: string
  fullname: string
  roleName?: string
  status?: boolean
}