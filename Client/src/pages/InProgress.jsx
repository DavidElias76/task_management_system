import formatDate from '../utils/formatDate.js';
import { TasksContext } from '../context/TasksContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { useContext } from 'react';
import { Loader2 } from 'lucide-react';

export default function InProgress() {
  const { tasks, loading, error } = useContext(TasksContext);
  const { user } = useContext(AuthContext);
  const { isDark, T } = useContext(ThemeContext);

  const allTasks = ['manager','admin'].includes(user?.role?.toLowerCase()) ? tasks : tasks.filter(t => t.assignee === user?.username);
  const inProgress = allTasks.filter(t => t.status === 'in-progress');

  const pColor = p => p ==='high'?'#f43f5e':p==='medium'?'#fbbf24':'#10b981';
  const pLabel = p => p ==='high'?'#f87171':p==='medium'?'#fbbf24':'#34d399';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: T.bg }}>
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-medium" style={{ background: T.cardBg, border:`1px solid ${T.cardBord}`, color: T.muted }}>
        <Loader2 size={16} className="animate-spin" style={{ color:'#38bdf8' }} /> Loading tasks...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6 lg:p-8" style={{ background: T.bg, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      {error && <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium" style={{ border:'1px solid rgba(248,113,113,0.3)', background:'rgba(248,113,113,0.08)', color:'#f87171' }}>{error}</div>}

      <div className="mb-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-1.5" style={{ color:'#38bdf8' }}>Workspace</p>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight m-0" style={{ color: T.head }}>In Progress</h1>
          <span className="text-xs rounded-full px-3.5 py-1.5" style={{ color: T.muted, background: T.tagBg, border:`1px solid ${T.tagBord}` }}>{inProgress.length} tasks</span>
        </div>
        <p className="text-sm mt-1" style={{ color: T.sub }}>Tasks currently being worked on</p>
      </div>

      {inProgress.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 gap-2">
          <Loader2 size={22} style={{ color: T.muted }} />
          <p className="text-sm font-semibold m-0" style={{ color: T.head }}>No tasks in progress</p>
          <p className="text-xs m-0" style={{ color: T.muted }}>Active tasks will appear here</p>
        </div>
      )}

      <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 list-none p-0 m-0">
        {inProgress.map(task => (
          <li key={task.id}
            className="flex flex-col rounded-2xl overflow-hidden transition-all duration-150"
            style={{ background: T.cardBg, border:`1px solid ${T.cardBord}` }}
            onMouseEnter={e => { e.currentTarget.style.border=`1px solid ${isDark?'rgba(56,189,248,0.35)':'#7dd3fc'}`; e.currentTarget.style.background=isDark?'rgba(255,255,255,0.07)':'#f8fafc'; }}
            onMouseLeave={e => { e.currentTarget.style.border=`1px solid ${T.cardBord}`; e.currentTarget.style.background=T.cardBg; }}
          >
            <div className="h-0.5 w-full" style={{ background: pColor(task.priority) }} />
            <div className="flex flex-col gap-3 p-5">

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: T.tagBg, border:`1px solid ${T.tagBord}` }}>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: pColor(task.priority) }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: pLabel(task.priority) }}>{task.priority}</span>
                </div>
                <span className="text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wide" style={{ color:isDark?'#38bdf8':'#0284c7', background:isDark?'rgba(56,189,248,0.10)':'#e0f2fe', border:`1px solid ${isDark?'rgba(56,189,248,0.25)':'#7dd3fc'}` }}>
                  In Progress
                </span>
              </div>

              <p className="text-sm font-bold leading-snug m-0" style={{ color: T.head }}>{task.title}</p>

              {task.description && (
                <p className="text-xs leading-relaxed m-0" style={{
                  color: T.muted,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background:'#38bdf8' }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background:'#38bdf8' }} />
                </span>
                <span className="text-[11px] font-medium" style={{ color:isDark?'rgba(56,189,248,0.7)':'#0284c7' }}>Active</span>
              </div>

              <div className="flex items-center justify-between pt-3 mt-auto" style={{ borderTop:`1px solid ${T.divider}` }}>
                <span className="text-xs" style={{ color: new Date(task.due) < new Date() ? '#f87171' : '#34d399' }}>Due {formatDate(task.due)}</span>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ background:isDark?'rgba(56,189,248,0.15)':'#e0f2fe', color:isDark?'#38bdf8':'#0284c7', border:`1px solid ${isDark?'rgba(56,189,248,0.25)':'#7dd3fc'}` }}>
                    {task.assignee ? task.assignee.slice(0,2).toUpperCase() : '?'}
                  </div>
                  <span className="text-xs font-semibold truncate" style={{ color: T.body, maxWidth: '110px' }}>
                    {task.assignee || 'Unassigned'}
                  </span>
                </div>
              </div>

            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}