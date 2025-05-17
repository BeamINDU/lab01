export type User = {
  id: string
  userid: string
  fullname: string
  email: string
}

export type UserPermission = {
  menuId: string;
  parentId: string;
  menuName: string;
  seq: number;
  icon: string;
  path: string;
  actions: number[];
};