import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

export const exportExcel = async <T>(rawData: T[], headers: string[], keys: (keyof T)[], fileName: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(fileName);

  // Add columns with 'No' as first
  worksheet.columns = [
    { header: 'No', key: 'no', width: 10 },
    ...headers.map((header, i) => ({
      header,
      key: keys[i] as string,
      width: 20,
    })),
  ];

  // Add rows
  rawData.forEach((item, index) => {
    const row: Record<string, any> = { no: index + 1 };
    keys.forEach((key) => {
      row[key as string] = item[key] ?? '';
    });
    worksheet.addRow(row);
  });

  // Export the file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `${fileName}.xlsx`);
};
