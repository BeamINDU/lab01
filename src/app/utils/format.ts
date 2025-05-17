import dayjs from 'dayjs';

export const formatDate = (rawValue: string | number | Date | null | undefined) => {
  if (!rawValue || !dayjs(rawValue).isValid()) {
    return 'N/A';
  }
  
  const date = dayjs(rawValue);
  return date.format('YYYY-MM-DD HH:mm:ss');
};

export const formatNumber = (value: number | null | undefined): string => {
  if (value == null) return '0';
  return value.toLocaleString(); // ค่า default: ตาม locale ปัจจุบัน เช่น en-US
};
