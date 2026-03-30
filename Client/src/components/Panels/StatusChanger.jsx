import {statusStyles} from '../../data/panel.js'
const STATUS_OPTIONS = ['todo', 'in-progress', 'completed', 'trash'];

export default function StatusChanger({ currentStatus, onStatusChange, disabled, isDark }) {
  return (
    <select
    style={{backgroundColor: isDark ? "#111827" : "#ffffff", color: isDark ? "#f9fafb" : "#111827"}}
      value={currentStatus}
      onChange={(e) => onStatusChange(e.target.value)}
      disabled={disabled}
      className={`text-xs font-semibold border rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2
        focus:ring-indigo-200 transition-all cursor-pointer
        ${statusStyles[currentStatus] ?? 'text-slate-500 border-slate-200'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-300'}`}
    >
      {STATUS_OPTIONS.map((s) => (
        <option style={{backgroundColor: isDark ? "#111827" : "#ffffff", color: isDark ? "#f9fafb" : "#111827"}} 
            key={s} value={s}>
              {s}
        </option>
      ))}
    </select>
  );
}