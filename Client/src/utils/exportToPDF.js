
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import formatDate from "./formatDate";

export default function exportToPDF(data, filename = "report") {
  const doc = new jsPDF();

  doc.text("Tasks Report", 14, 10);

  autoTable(doc, {
    head: [["Title", "Priority", "Status", "Assignee", "Due"]],
    body: data.map(t => [t.title, t.priority, t.status, t.assignee, formatDate(t.due)]),
  });

  doc.save(`${filename}-${Date.now()}.pdf`);
};