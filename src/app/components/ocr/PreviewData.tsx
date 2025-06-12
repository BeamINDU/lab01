import React, { useEffect, useState } from "react";
import { MathJaxContext, MathJax } from "better-react-mathjax";

// MathJax configuration
const config = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },
};

// Define styles types
interface StylesProps {
  [key: string]: React.CSSProperties;
}

// Table component props
interface TableProps {
  data: string;
}

// Table component
const Table: React.FC<TableProps> = ({ data }) => {
  const tableLines = data.split("\n").filter((line) => line.includes("|"));

  // Make sure we have valid table data
  if (tableLines.length < 3) {
    return <p>Invalid table data</p>;
  }

  const headers = tableLines[0]
    .split("|")
    .filter((h) => h.trim() !== "")
    .map((h) => h.trim());

  const bodyRows = tableLines.slice(2).map((row) =>
    row
      .split("|")
      .filter((cell, index) => index > 0 && index < row.split("|").length - 1)
      .map((cell) => cell.trim())
  );

  const tableStyles: StylesProps = {
    table: {
      borderCollapse: "collapse",
      width: "100%",
      border: "2px solid #4a5568",
      margin: "1rem 0",
      fontSize: "0.875rem",
    },
    th: {
      border: "2px solid #4a5568",
      padding: "8px",
      backgroundColor: "#f8fafc",
      fontWeight: "bold",
      textAlign: "left",
      fontSize: "0.875rem",
    },
    td: {
      border: "2px solid #4a5568",
      padding: "8px",
      textAlign: "left",
      fontSize: "0.875rem",
    },
  };

  return (
    <table style={tableStyles.table}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} style={tableStyles.th}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {bodyRows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} style={tableStyles.td}>
                <MathJax>{cell}</MathJax>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Process Markdown links
const processLinks = (text: string): string => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let result = text;
  let match;
  const replacements: Array<{ original: string; replacement: string }> = [];

  while ((match = linkRegex.exec(text)) !== null) {
    replacements.push({
      original: match[0],
      replacement: `<a href="${match[2]}" target="_blank" rel="noopener noreferrer" style="color: #3182ce; text-decoration: underline;">${match[1]}</a>`,
    });
  }

  for (let i = replacements.length - 1; i >= 0; i--) {
    result = result.replace(
      replacements[i].original,
      replacements[i].replacement
    );
  }

  return result;
};

// Process bold text
const processBold = (text: string): string => {
  return text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
};

// Main App component
interface PreviewDataProps {
  data: string;
}

export default function PreviewData({ data }: PreviewDataProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setContent(data); // JSON.parse(data);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          // fontFamily: "Arial, sans-serif",
        }}
      >
         Loading...
      </div>
    );
  }

  const containerStyles: React.CSSProperties = {
    maxWidth: "900px",
    margin: "0 auto",
    // padding: "20px",
    // fontFamily: "Arial, sans-serif",
  };

  const cardStyles: React.CSSProperties = {
    borderRadius: "8px",
    padding: "24px",
    marginBottom: "20px",
    // backgroundColor: "white",
    // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const paragraphStyles: React.CSSProperties = {
    marginBottom: "16px",
    lineHeight: "1.6",
    fontSize: "0.875rem",
  };

  // Split the content into paragraphs
  const paragraphs = content.split("\n\n").filter((p) => p.trim());

  return (
    <>
    {/* {data} */}
    <MathJaxContext version={3} config={config}>
      <div style={containerStyles}>
        <div style={cardStyles}>
          {paragraphs.map((paragraph, pIndex) => {
            // Check if paragraph contains a table (has multiple pipe characters)
            if (paragraph.includes("|") && paragraph.split("|").length > 2) {
              return <Table key={pIndex} data={paragraph} />;
            } else {
              // Process text content with MathJax
              return (
                <MathJax key={pIndex}>
                  <div
                    style={paragraphStyles}
                    dangerouslySetInnerHTML={{
                      __html: processBold(processLinks(paragraph)),
                    }}
                  />
                </MathJax>
              );
            }
          })}
        </div>
      </div>
    </MathJaxContext>
    </>
  );
};
