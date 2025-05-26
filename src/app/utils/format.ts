export const formatNumber = (value: number | null | undefined): string => {
  if (value == null) return '0';
  return value.toLocaleString(); // ค่า default: ตาม locale ปัจจุบัน เช่น en-US
};
