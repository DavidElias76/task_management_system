import { useState, useRef } from "react";
import { formatTime } from "../../utils/exportPanel.js";
import { Loader, Send } from "lucide-react";

export default function Comments({ comments, onAddComment, currentUser, isDark, T }) {
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const bottomRef = useRef(null);


  const handleSubmit = async () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    setSubmitting(true);
    await onAddComment(trimmed);
    setBody('');
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <p className="text-xs" style={{ color: T.muted }}>No comments yet. Be the first to add one.</p>
        ) : (
          comments.map((c, i) => (
            <div key={c.id ?? i} className="flex gap-2.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                style={{ background: isDark ? 'rgba(99,102,241,0.15)' : '#e0e7ff', color: '#6366f1' }}
              >
                {(c.username ?? currentUser?.username ?? '?').toString().slice(0, 2).toUpperCase()}
              </div>
              <div
                className="flex-1 rounded-xl px-3 py-2"
                style={{ background: T.tagBg, border: `1px solid ${T.tagBord}` }}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold" style={{ color: T.head }}>
                    {c.username ?? currentUser?.username ?? 'User'}
                  </span>
                  <span className="text-[10px] tabular-nums" style={{ color: T.muted }}>
                    {formatTime(c.created_at)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed m-0" style={{ color: T.body }}>{c.body}</p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 mt-1">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
          style={{ background: isDark ? 'rgba(99,102,241,0.15)' : '#e0e7ff', color: '#6366f1' }}
        >
          {(currentUser?.username ?? '?').slice(0, 2).toUpperCase()}
        </div>
        <input
          type="text"
          value={body}
          onChange={e => setBody(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
          placeholder="Write a comment..."
          className="flex-1 h-9 px-3 text-sm rounded-xl outline-none transition-all"
          style={{
            background: T.inputBg,
            border: `1px solid ${T.inputBord}`,
            color: T.head,
          }}
          onFocus={e => {
            e.target.style.borderColor = isDark ? 'rgba(99,102,241,0.5)' : '#a5b4fc';
            e.target.style.boxShadow = `0 0 0 3px ${isDark ? 'rgba(99,102,241,0.10)' : 'rgba(99,102,241,0.07)'}`;
          }}
          onBlur={e => {
            e.target.style.borderColor = T.inputBord;
            e.target.style.boxShadow = 'none';
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!body.trim() || submitting}
          className="flex items-center gap-1.5 px-3 py-2 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 border-none cursor-pointer"
          style={{
            background: '#6366f1',
            opacity: !body.trim() || submitting ? 0.4 : 1,
            cursor: !body.trim() || submitting ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={e => { if (body.trim() && !submitting) e.currentTarget.style.background = '#4f46e5'; }}
          onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}
        >
          {submitting ? <Loader size={13} className="animate-spin" /> : <Send size={13} />}
        </button>
      </div>
    </div>
  );
}