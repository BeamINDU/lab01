export type MenuItem = {
  id: string,
  label: string;
  path?: string;
  icon?: string;
  children?: MenuItem[];
  action?: number[];
};
