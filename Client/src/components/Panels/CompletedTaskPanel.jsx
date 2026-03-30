import { useContext, useEffect, useRef, useState } from 'react';
import { X, Trash2, CheckCircle2, AlertTriangle, Clock, Tag, Calendar, User, Paperclip, MessageSquare } from 'lucide-react';
import TaskPanelProvider, { TaskPanelContext } from '../../context/TaskPanelContext';
import Comments from '../Panels/Comments.jsx';
import TimeLogs from '../Panels/TimeLogs.jsx';
import { formatDate } from '../../utils/exportPanel.js';
import { priorityBar, priorityBadge } from '../../data/panel.js';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';

const BASE_URL = 'http://localhost:8080';

export default function CompletedTaskPanel({ task, onClose, onDeleted }) {
  const { comments, attachments, timerLogs, delays, loading, refetchComments, refetchAttachments, refetchTimer, refetchDelays } = useContext(TaskPanelContext);
  const { isDark, T } = useContext(ThemeContext);

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const overlayRef = useRef(null);
  
  const taskComments = comments.filter(c => c.task_id === task.id).slice(-2);
  const taskAttachments= attachments.filter(a => a.task_id === task.id);
  const taskTimeLogs = timerLogs.filter(t => t.task_id === task.id).slice(-3);
  const taskDelays = delays.filter(d => d.task_id === task.id).slice(0, 2);
  const isDelayed = taskDelays.length > 0;

  const taskData = [
    { label: 'Assignee', value: task.assignee || '—' },
    { label: 'Category', value: task.category || '—' },
    { label: 'Due', value: formatDate(task.due ?? task.due_date) },
    { label: 'Est. hours',value: task.estimated_hours ? `${task.estimated_hours}` : '—' },
    { label: 'Created by',value: task.created_by || '—' },
  ];

  useEffect(() => {
    refetchComments();
    refetchAttachments();
    refetchTimer();
    refetchDelays();
  }, [task.id]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleOverlay = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleDelete = async (id) => {
    if (!deleteConfirm) { setDeleteConfirm(true); return; }
    setDeleting(true);
    try {
      await axios.delete(`${BASE_URL}/api/tasks/${id}`, { withCredentials: true });
      onDeleted?.(task.id);
      onClose();
    } catch (err) {
      console.error('Delete failed:', err);
      setDeleting(false);
      setDeleteConfirm(false);
    }
  };

  const priorityAccent =
    task.priority === 'high' ? '#f43f5e' :
    task.priority === 'medium' ? '#fbbf24' : '#10b981';

  const panelBg   = isDark ? '#13141c' : '#ffffff';
  const panelBord = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const overlayBg = isDark ? 'rgba(0,0,0,0.60)' : 'rgba(15,23,42,0.35)';

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlay}
      className="fixed inset-0 z-50 flex justify-end"
      style={{ background: overlayBg, backdropFilter: 'blur(4px)' }}
    >
      <div
        className="relative h-full w-full max-w-xl flex flex-col overflow-hidden"
        style={{
          background: panelBg,
          borderLeft: `1px solid ${panelBord}`,
          boxShadow: isDark ? '-24px 0 60px rgba(0,0,0,0.5)' : '-12px 0 40px rgba(0,0,0,0.10)',
          animation: 'slideIn 0.25s cubic-bezier(0.32,0.72,0,1)',
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        <div style={{ height: 3, background: priorityAccent, flexShrink: 0 }} />

        <div
          className="shrink-0 px-6 pt-5 pb-4 flex items-start justify-between gap-4"
          style={{ borderBottom: `1px solid ${T.divider}` }}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                style={{ color: isDark?'#34d399':'#059669', background: isDark?'rgba(52,211,153,0.12)':'#d1fae5', border: `1px solid ${isDark?'rgba(52,211,153,0.25)':'#6ee7b7'}` }}
              >
                <CheckCircle2 size={10} /> Completed
              </span>

              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                style={{
                  color: task.priority==='high'?'#f87171':task.priority==='medium'?'#fbbf24':'#34d399',
                  background: task.priority==='high'?(isDark?'rgba(248,113,113,0.12)':'#fff1f2'):task.priority==='medium'?(isDark?'rgba(251,191,36,0.12)':'#fef3c7'):(isDark?'rgba(52,211,153,0.12)':'#d1fae5'),
                  border: `1px solid ${task.priority==='high'?(isDark?'rgba(248,113,113,0.25)':'#fecaca'):task.priority==='medium'?(isDark?'rgba(251,191,36,0.25)':'#fcd34d'):(isDark?'rgba(52,211,153,0.25)':'#6ee7b7')}`,
                }}
              >
                {task.priority}
              </span>

              {isDelayed && (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                  style={{ color:isDark?'#fbbf24':'#d97706', background:isDark?'rgba(251,191,36,0.12)':'#fef3c7', border:`1px solid ${isDark?'rgba(251,191,36,0.25)':'#fcd34d'}` }}
                >
                  <AlertTriangle size={10} /> Delayed
                </span>
              )}
            </div>
            <h2 className="text-sm font-bold leading-snug" style={{ color: T.head }}>{task.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0 border-none cursor-pointer"
            style={{ background: isDark?'rgba(255,255,255,0.06)':'#f1f5f9', color: T.muted }}
            onMouseEnter={e => { e.currentTarget.style.background=isDark?'rgba(255,255,255,0.10)':'#e2e8f0'; e.currentTarget.style.color=T.head; }}
            onMouseLeave={e => { e.currentTarget.style.background=isDark?'rgba(255,255,255,0.06)':'#f1f5f9'; e.currentTarget.style.color=T.muted; }}
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {task.description && (
            <div className="rounded-2xl p-4" style={{ background: T.cardBg, border: `1px solid ${T.cardBord}` }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: T.muted }}>Description</p>
              <p className="text-sm leading-relaxed" style={{ color: T.body }}>{task.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {taskData.map(({ label, value }) => (
              <div key={label} className="rounded-xl px-3 py-2.5 flex flex-col gap-0.5" style={{ background: T.tagBg, border: `1px solid ${T.tagBord}` }}>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: T.muted }}>{label}</span>
                <span className="text-xs font-semibold truncate" style={{ color: T.body }}>{value}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-4" style={{ background: isDark?'rgba(52,211,153,0.06)':'#f0fdf4', border:`1px solid ${isDark?'rgba(52,211,153,0.18)':'#6ee7b7'}` }}>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={14} style={{ color:'#34d399' }} />
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] m-0" style={{ color: isDark?'#34d399':'#059669' }}>Task Completed</p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex flex-col">
                <span className="text-[10px] font-medium" style={{ color: isDark?'rgba(52,211,153,0.6)':'#6ee7b7' }}>Time Logs</span>
                <span className="text-lg font-extrabold" style={{ color: isDark?'#34d399':'#059669' }}>{taskTimeLogs.length}</span>
              </div>
              <div className="w-px h-8" style={{ background: isDark?'rgba(52,211,153,0.2)':'#6ee7b7' }} />
              <div className="flex flex-col">
                <span className="text-[10px] font-medium" style={{ color: isDark?'rgba(52,211,153,0.6)':'#6ee7b7' }}>Comments</span>
                <span className="text-lg font-extrabold" style={{ color: isDark?'#34d399':'#059669' }}>{taskComments.length}</span>
              </div>
              <div className="w-px h-8" style={{ background: isDark?'rgba(52,211,153,0.2)':'#6ee7b7' }} />
              <div className="flex flex-col">
                <span className="text-[10px] font-medium" style={{ color: isDark?'rgba(52,211,153,0.6)':'#6ee7b7' }}>Attachments</span>
                <span className="text-lg font-extrabold" style={{ color: isDark?'#34d399':'#059669' }}>{taskAttachments.length}</span>
              </div>
              {isDelayed && (
                <>
                  <div className="w-px h-8" style={{ background: isDark?'rgba(52,211,153,0.2)':'#6ee7b7' }} />
                  <div className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg"
                    style={{ color:isDark?'#fbbf24':'#d97706', background:isDark?'rgba(251,191,36,0.10)':'#fef3c7', border:`1px solid ${isDark?'rgba(251,191,36,0.20)':'#fcd34d'}` }}>
                    <AlertTriangle size={11} /> Submitted late
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <SectionLabel label="Time Logs" color="#a78bfa" isDark={isDark} T={T} />
            {loading ? <Skeleton T={T} /> : <TimeLogs logs={taskTimeLogs} T={T}/>}
          </div>

          {!isDelayed && (
            <div>
              <SectionLabel label="Latest Comments" color="#38bdf8" isDark={isDark} T={T} />
              {loading ? (
                <Skeleton T={T} />
              ) : taskComments.length === 0 ? (
                <p className="text-xs mt-2" style={{ color: T.muted }}>No comments on this task.</p>
              ) : (
                <div className="flex flex-col gap-2 mt-3">
                  {taskComments.map((c, i) => (
                    <div key={c.id ?? i} className="flex gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                        style={{ background:'rgba(139,92,246,0.15)', color:'#a78bfa', border:'1px solid rgba(139,92,246,0.25)' }}
                      >
                        {(c.username ?? '?').toString().slice(0,2).toUpperCase()}
                      </div>
                      <div className="flex-1 rounded-xl px-3 py-2" style={{ background:T.tagBg, border:`1px solid ${T.tagBord}` }}>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold" style={{ color:T.head }}>{c.username ?? c.author ?? 'User'}</span>
                          <span className="text-[10px]" style={{ color:T.muted }}>{formatDate(c.created_at)}</span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color:T.body }}>{c.body ?? c.content ?? c.text ?? ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!isDelayed && (
            <div>
              <SectionLabel label="Attachments" color="#fbbf24" isDark={isDark} T={T} />
              {loading ? (
                <Skeleton T={T} />
              ) : taskAttachments.length === 0 ? (
                <p className="text-xs mt-2" style={{ color: T.muted }}>No attachments on this task.</p>
              ) : (
                <ul className="flex flex-col gap-2 mt-3 list-none p-0 m-0">
                  {taskAttachments.map((a, i) => (
                    <li
                      key={a.id ?? i}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                      style={{ background:T.tagBg, border:`1px solid ${T.tagBord}` }}
                      >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm"
                        style={{ background:T.cardBg, border:`1px solid ${T.cardBord}` }}
                      >
                        {a.mime_type === 'application/pdf'    ? '📕'
                          : a.mime_type?.startsWith('image/') ? '🖼️'
                          : a.mime_type?.includes('word')     ? '📝'
                          : '📄'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color:T.head }}>{a.file_name ?? 'File'}</p>
                        <p className="text-[10px]" style={{ color:T.muted }}>
                          {a.file_size ? `${Math.round(a.file_size/1024)} KB` : ''}
                          {a.uploaded_by ? ` · ${a.uploaded_by}` : ''}
                        </p>
                      </div>
                      <a
                        href={`${BASE_URL}/api/tasks/attachments/${a.id}/download`}
                        download={a.file_name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-semibold rounded-lg shrink-0 transition-all"
                        style={{ color:'#a78bfa', background:isDark?'rgba(139,92,246,0.12)':'#ede9fe', border:`1px solid ${isDark?'rgba(139,92,246,0.25)':'#c4b5fd'}` }}
                      >
                        ↓ Download
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div>
            <SectionLabel label="Delay Reasons" color="#fbbf24" isDark={isDark} T={T} />
            {loading ? (
              <Skeleton T={T} />
            ) : taskDelays.length === 0 ? (
              <p className="text-xs mt-2" style={{ color: T.muted }}>No delay reasons for this task.</p>
            ) : (
              <div className="flex flex-col gap-2 mt-3">
                {taskDelays.map((d, i) => (
                  <div
                    key={d.id ?? i}
                    className="flex gap-3 p-3.5 rounded-xl"
                    style={{ background: isDark?'rgba(251,191,36,0.08)':'#fef3c7', border:`1px solid ${isDark?'rgba(251,191,36,0.20)':'#fcd34d'}` }}
                  >
                    <AlertTriangle size={12} style={{ color:'#fbbf24', flexShrink:0, marginTop:2 }} />
                    <p className="text-xs leading-relaxed" style={{ color: isDark?'#fbbf24':'#92400e' }}>
                      {d.reason ?? d.description ?? d.content ?? '—'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div
          className="shrink-0 px-6 py-4"
          style={{ borderTop:`1px solid ${T.divider}`, background: panelBg }}>

          {deleteConfirm ? (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-center" style={{ color: T.muted }}>Permanently delete this task?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {setDeleteConfirm(false); onClose()}}
                  className="flex-1 py-2.5 text-xs font-semibold rounded-xl cursor-pointer border-none transition-all"
                  style={{ background:T.tagBg, color:T.muted, border:`1px solid ${T.tagBord}` }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  disabled={deleting}
                  className="flex-1 py-2.5 text-xs font-semibold text-white rounded-xl transition-all flex items-center justify-center gap-1.5 border-none cursor-pointer"
                  style={{ background:'#f43f5e', opacity: deleting ? 0.7 : 1 }}
                >
                  {deleting
                    ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    : <Trash2 size={12} />}
                  {deleting ? 'Deleting…' : 'Delete Task'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleDelete(task.id)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer border-none"
              style={{ color:'#f87171', background:isDark?'rgba(248,113,113,0.08)':'#fff1f2', border:`1px solid ${isDark?'rgba(248,113,113,0.20)':'#fecaca'}` }}
              onMouseEnter={e => e.currentTarget.style.background=isDark?'rgba(248,113,113,0.14)':'#ffe4e6'}
              onMouseLeave={e => e.currentTarget.style.background=isDark?'rgba(248,113,113,0.08)':'#fff1f2'}
            >
              <Trash2 size={12} /> Delete Task
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

function SectionLabel({ label, color, T }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-1 h-3.5 rounded-full shrink-0" style={{ background: color }} />
      <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: T.muted }}>{label}</span>
    </div>
  );
}

function Skeleton({ T }) {
  return (
    <div
      className="mt-2 h-14 rounded-xl animate-pulse"
      style={{ background: T.tagBg }}
    />
  );
}