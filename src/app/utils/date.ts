import { format, isValid, parseISO } from 'date-fns';
import { th, enUS } from 'date-fns/locale';

export const formatDateTime = (rawValue: string | number | Date | null | undefined): string => {
  if (!rawValue) return '';

  let date: Date;

  if (typeof rawValue === 'string') {
    date = parseISO(rawValue);
  } else {
    date = new Date(rawValue);
  }

  if (!isValid(date)) return '';

  return format(date, 'yyyy-MM-dd HH:mm:ss', { locale: enUS });
};


export const formatDate = (rawValue: string | number | Date | null | undefined): string => {
  if (!rawValue) return '';

  let date: Date;

  if (typeof rawValue === 'string') {
    date = parseISO(rawValue);
  } else {
    date = new Date(rawValue);
  }

  if (!isValid(date)) return '';

  return format(date, 'yyyy-MM-dd', { locale: enUS });
};


export const formatTime = (rawValue: string | number | Date | null | undefined): string => {
  if (!rawValue) return '';

  let date: Date;

  if (typeof rawValue === 'string') {
    date = parseISO(rawValue);
  } else {
    date = new Date(rawValue);
  }

  if (!isValid(date)) return '';

  return format(date, 'HH:mm', { locale: enUS });
};