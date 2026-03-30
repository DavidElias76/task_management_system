import { FileText } from 'lucide-react';
export default function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
        <FileText size={14} className="text-slate-400" />
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}