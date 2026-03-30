import { useContext, useState } from 'react';
import { CheckCircle2, Eye } from 'lucide-react';
import { TasksContext } from '../context/TasksContext';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext.jsx';
import CompletedTaskPanel from '../components/Panels/CompletedTaskPanel.jsx';
import { formatDate } from '../utils/exportPanel.js';

export default function Completed() {
  const { tasks, error, refetch } = useContext(TasksContext);
  const { user } = useContext(AuthContext);
  const { isDark, T } = useContext(ThemeContext);
  const [activeTask, setActiveTask] = useState(null);

  const isManager = ['manager','admin'].includes(user?.role?.toLowerCase());
  const isUser = user?.role?.toLowerCase() === 'user'
  const allTasks = isManager ? tasks : tasks.filter(t => t.assignee === user?.username);
  const completed = allTasks.filter(t => t.status === 'completed');
  const handleDeleted = () => { refetch(); setActiveTask(null); };

  const pColor = p => p ==='high' ? '#f43f5e': p ==='medium' ? '#fbbf24':'#10b981';
  const pLabel = p => p ==='high' ? '#f87171': p ==='medium' ? '#fbbf24':'#34d399';

  return (
    <div className="min-h-screen p-6 lg:p-8" style={{ background: T.bg, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      {error && <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium" style={{ border:'1px solid rgba(248,113,113,0.3)', background:'rgba(248,113,113,0.08)', color:'#f87171' }}>{error}</div>}

      <div className="mb-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-1.5" style={{ color:'#34d399' }}>Workspace</p>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight m-0" style={{ color: T.head }}>Completed</h1>
          <span className="text-xs rounded-full px-3.5 py-1.5" style={{ color: T.muted, background: T.tagBg, border:`1px solid ${T.tagBord}` }}>{completed.length} tasks</span>
        </div>
        <p className="text-sm mt-1" style={{ color: T.sub }}>All finished tasks in one place</p>
      </div>

      {completed.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 gap-2">
          <CheckCircle2 size={22} style={{ color: T.muted }} />
          <p className="text-sm font-semibold m-0" style={{ color: T.head }}>No completed tasks yet</p>
          <p className="text-xs m-0" style={{ color: T.muted }}>Finished tasks will appear here</p>
        </div>
      )}

      <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 list-none p-0 m-0">
        {completed.map(task => (
          <li key={task.id}
            className="flex flex-col rounded-2xl overflow-hidden transition-all duration-150"
            style={{ background: T.cardBg, border:`1px solid ${T.cardBord}` }}
            onMouseEnter={e => { e.currentTarget.style.border=`1px solid ${isDark?'rgba(52,211,153,0.35)':'#6ee7b7'}`; e.currentTarget.style.background=isDark?'rgba(255,255,255,0.07)':'#f8fafc'; }}
            onMouseLeave={e => { e.currentTarget.style.border=`1px solid ${T.cardBord}`; e.currentTarget.style.background=T.cardBg; }}
          >
            <div className="h-0.5 w-full" style={{ background: pColor(task.priority) }} />
            <div className="flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: T.tagBg, border:`1px solid ${T.tagBord}` }}>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: pColor(task.priority) }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: pLabel(task.priority) }}>{task.priority}</span>
                </div>
                <span className="text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wide" style={{ color:isDark?'#34d399':'#059669', background:isDark?'rgba(52,211,153,0.10)':'#d1fae5', border:`1px solid ${isDark?'rgba(52,211,153,0.25)':'#6ee7b7'}` }}>
                  Completed
                </span>
              </div>

              <p className="text-sm font-bold leading-snug m-0" style={{ color: T.head }}>{task.title}</p>
              <div className="flex items-center justify-between pt-3 mt-auto" style={{ borderTop:`1px solid ${T.divider}` }}>
                <span className="text-xs" style={{ color: T.muted }}>Due {formatDate(task.due)}</span>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background:isDark?'rgba(52,211,153,0.15)':'#d1fae5', color:isDark?'#34d399':'#059669', border:`1px solid ${isDark?'rgba(52,211,153,0.25)':'#6ee7b7'}` }}>
                  {task.assignee ? task.assignee.slice(0,2).toUpperCase() : '?'}
                </div>
              </div>

              {isManager && (
                <button onClick={() => setActiveTask(task)} className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl cursor-pointer border" style={{ color:isDark?'#34d399':'#059669', background:isDark?'rgba(52,211,153,0.10)':'#d1fae5', borderColor:isDark?'rgba(52,211,153,0.25)':'#6ee7b7' }}>
                  <Eye size={11}/> View Task
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {activeTask && isManager && (
        <CompletedTaskPanel task={activeTask} onClose={() => setActiveTask(null)} onDeleted={handleDeleted} />
      )}
    </div>
  );
}