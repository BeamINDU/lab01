import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

export const exportExcel = async <T>(
  rawData: T[],
  headers: string[],
  keys: (keyof T)[],
  fileName: string
) => {
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

  // Style header row (first row)
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFBCE0FD' }, // Light blue background
    };
    cell.font = {
      bold: true,
      color: { argb: 'FF000000' }, // Black text
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // Style detail rows
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // skip header
    row.eachCell((cell) => {
      // Set border
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      // Align: number => right, others => left
      const value = cell.value;
      if (typeof value === 'number') {
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      }
    });
  });


  // Export the file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `${fileName}.xlsx`);
};
