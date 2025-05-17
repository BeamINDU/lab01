import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

export const exportCSV = async <T>(rawData: T[], headers: string[], keys: (keyof T)[], fileName: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(fileName);

  // Add header row manually (including 'No')
  worksheet.addRow(['No', ...headers]);

  // Add data rows
  rawData.forEach((item, index) => {
    const row = [index + 1, ...keys.map((key) => item[key] ?? '')];
    worksheet.addRow(row);
  });

  // Generate CSV buffer
  const csvBuffer = await workbook.csv.writeBuffer();

  // Save CSV file
  const blob = new Blob([csvBuffer], {
    type: 'text/csv;charset=utf-8;',
  });
  saveAs(blob, `${fileName}.csv`);
};
