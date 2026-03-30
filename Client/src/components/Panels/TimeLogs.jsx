import { Clock } from "lucide-react";

export default function TimeLogs({ logs, T}) {
  if (!logs.length)
    return (
      <p className="text-xs mt-3" style={{ color: T.muted }}>
        No time logs yet. Start the timer to begin tracking.
      </p>
    );

  return (
    <ul className="mt-3 flex flex-col gap-1.5 list-none p-0 m-0">
      {logs.map((log, i) => (
        <li
          key={log.id ?? i}
          className="flex items-center gap-3 text-xs px-3 py-2 rounded-lg"
          style={{
            background: T.tagBg,
            border: `1px solid ${T.tagBord}`,
            color: T.body,
          }}
        >
          <Clock size={11} className="shrink-0" style={{ color: T.muted }} />

          <span className="tabular-nums" style={{ color: T.body }}>
            {new Date(log.started_at).toLocaleTimeString()} →{" "}
            {new Date(log.ended_at).toLocaleTimeString()}
          </span>

          <span className="ml-auto font-semibold tabular-nums" style={{ color: T.head }}>
            {log.duration_minutes}
          </span>

          {log.note && (
            <span className="truncate max-w-32" style={{ color: T.muted }}>
              {log.note}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}