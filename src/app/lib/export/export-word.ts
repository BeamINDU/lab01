import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } from 'docx';

export const exportWord = async <T>(rawData: T[], headers: string[], keys: (keyof T)[], fileName: string) => {
  // Add "No" as the first header
  const fullHeaders = ['No', ...headers];

  // Header row with "No" as the first column
  const headerRow = new TableRow({
    children: fullHeaders.map(header =>
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: header, bold: true })] })],
        width: { size: 20, type: WidthType.PERCENTAGE },
      })
    ),
  });

  // Rows
  const dataRows = rawData.map((item, index) =>
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph(String(index + 1))] }), // Add "No" here
        ...keys.map((key) =>
          new TableCell({
            children: [new Paragraph(String(item[key]))],
          })
        ),
      ],
    })
  );

  const table = new Table({
    rows: [headerRow, ...dataRows],
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
  });

  const doc = new Document({
    sections: [{ children: [table] }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${fileName}.docx`);
};
