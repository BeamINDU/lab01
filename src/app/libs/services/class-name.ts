import { ClassName } from "@/app/types/class-name";
import { SelectOption, } from "@/app/types/select-option";

export const getClassName = async () => {
  return [
    { id: '1', name: 'defect' },
    { id: '2', name: 'scratch' },
    { id: '3', name: 'dent' },
    { id: '4', name: 'missing' },
    { id: '5', name: 'crack' },
  ] as ClassName[];
}; 
