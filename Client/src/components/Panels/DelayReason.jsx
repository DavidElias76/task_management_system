import { Clock, ChevronDown, TriangleAlert } from "lucide-react";

const DELAY_REASONS = [
  "Task was more complex than estimated",
  "Blocked by dependencies",
  "Unexpected technical issues",
  "Requirements changed mid-task",
  "Resource unavailability",
  "Other",
];

export default function DelayReason({ value, onChange }) {
  return (
    <div className="flex flex-col gap-3">

      <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
        <TriangleAlert size={15} className="text-red-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-red-600">Task exceeded estimated time</p>
          <p className="text-xs text-red-400 mt-0.5">
            Select or describe the reason below before submitting.
          </p>
        </div>
      </div>

      <div className="relative">
        <select
         style={{backgroundColor: isDark ? "#111827" : "#ffffff", color: isDark ? "#f9fafb" : "#111827"}}
          onChange={(e) => e.target.value && onChange(e.target.value)}
          className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-500 bg-white focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all cursor-pointer"
          defaultValue="">
          <option value="" disabled>Quick select a reason...</option>
          {DELAY_REASONS.map((reason) => (
            <option
             style={{backgroundColor: isDark ? "#111827" : "#ffffff", color: isDark ? "#f9fafb" : "#111827"}}
             key={reason} 
             value={reason}
             >
              {reason}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe in detail why the task exceeded the estimated time..."
        rows={4}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all"/>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock size={11} /> Logged as delayed
          </span>
          <span className={`text-xs tabular-nums ${value.length > 280 ? 'text-red-400 font-semibold' : 'text-slate-400'}`}>
            {value.length} / 300
          </span>
        </div>

    </div>
  );
}