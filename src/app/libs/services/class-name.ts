import { ClassName } from "@/app/types/class-name";
import { SelectOption, } from "@/app/types/select-option";
import { extractErrorMessage } from '@/app/utils/errorHandler';

export const getClassName = async () => {
  try {
      return [
      { id: '1', name: 'defect' },
      { id: '2', name: 'scratch' },
      { id: '3', name: 'dent' },
      { id: '4', name: 'missing' },
      { id: '5', name: 'crack' },
    ] as ClassName[];
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
}; 
