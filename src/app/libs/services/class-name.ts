import { ClassName } from "@/app/types/class-name";
import { SelectOption, } from "@/app/types/select-option";

export const getClassName = async () => {
  return [
    { id: '1', name: 'houseclip missing' },
    { id: '2', name: 'Good clip' },
  ] as ClassName[];
};
