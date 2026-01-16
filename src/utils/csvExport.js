/**
 * Exports an array of objects to a CSV file.
 * @param {Array} data - The data to export.
 * @param {string} filename - The name of the resulting file.
 */
export const exportToCSV = (data, filename = "export.csv") => {
  if (!data || !data.length) return;

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(","));

  // Add rows
  for (const row of data) {
    const values = headers.map((header) => {
      const escaped = ("" + (row[header] || "")).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `${filename}_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
