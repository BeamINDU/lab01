export type MenuItem = {
  id: string,
  label: string;
  path?: string;
  children?: MenuItem[];
  action?: number[];
};
