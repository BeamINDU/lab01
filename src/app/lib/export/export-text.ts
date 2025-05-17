export const exportText = async <T>(rawData: T[], headers: string[], keys: (keyof T)[], fileName: string) => {
  // Add "No" to the headers
  const fullHeaders = ['No', ...headers];

  const rows = rawData.map((item, index) =>
    [index + 1, ...keys.map((key) => String(item[key]))].join('\t') // Add "No" here
  );

  const content = [fullHeaders.join('\t'), ...rows].join('\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};


