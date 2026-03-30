import * as XLSX from 'xlsx';

export default function exportToExcel(data, filename) {
  if (!data || data.length === 0) {
    alert("No data available to export.");
    return;
  }

  const formattedData = data.map((task, index) => ({
    No: index + 1,
    Title: task.title || '',
    Description: task.description || '',
    Status: task.status || '',
    Priority: task.priority || '',
    Assignee: task.assignee || '',
    Due_Date: task.due ? new Date(task.due).toLocaleDateString() : '',
    Created_At: task.created_at ? new Date(task.created_at).toLocaleDateString() : '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks Report");

  worksheet["!cols"] = [
    { wch: 6 },
    { wch: 25 },
    { wch: 35 },
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
    { wch: 15 },
    { wch: 18 },
  ];

  XLSX.writeFile(workbook, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}