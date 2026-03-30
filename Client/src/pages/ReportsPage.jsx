import { CheckCircle, Clock, Trash2, BarChart3, Users, AlertTriangle, ListTodo, Loader2, FileSpreadsheet, FileText } from 'lucide-react';
import exportToExcel from '../utils/exportToExcel.js';
import exportToPDF from '../utils/exportToPDF.js';
import formatDate from '../utils/formatDate.js';
import { TasksContext } from '../context/TasksContext.jsx';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { useContext } from 'react';

export default function ReportsPage() {
  const { tasks, loading } = useContext(TasksContext);
  const { isDark, T } = useContext(ThemeContext);
  const total = tasks.length;
  const completed = tasks.filter(t=>t.status==='completed').length;
  const inProgress= tasks.filter(t=>t.status==='in-progress').length;
  const todo = tasks.filter(t=>t.status==='todo').length;
  const trash = tasks.filter(t=>t.status==='trash').length;
  const high = tasks.filter(t=>t.priority==='high').length;
  const medium = tasks.filter(t=>t.priority==='medium').length;
  const low  = tasks.filter(t=>t.priority==='low').length;
  const completionRate = total>0 ? Math.round((completed/total)*100) : 0;

  const assignees = [...new Set(tasks.map(t=>t.assignee))];
  const tasksByAssignee = assignees.map(a => ({
    assignee:a,
    total:tasks.filter(t=>t.assignee===a).length,
    completed:tasks.filter(t=>t.assignee===a&&t.status==='completed').length,
    inProgress:tasks.filter(t=>t.assignee===a&&t.status==='in-progress').length,
    todo:tasks.filter(t=>t.assignee===a&&t.status==='todo').length,
  }));
  const recentTasks = [...tasks].slice(0,5);

  const statusBadge = s => ({ completed:{c:isDark?'#34d399':'#059669',bg:isDark?'rgba(52,211,153,0.10)':'#d1fae5',b:isDark?'rgba(52,211,153,0.25)':'#6ee7b7'}, 'in-progress':{c:isDark?'#a78bfa':'#7c3aed',bg:isDark?'rgba(139,92,246,0.10)':'#ede9fe',b:isDark?'rgba(139,92,246,0.25)':'#c4b5fd'}, todo:{c:isDark?'#94a3b8':'#64748b',bg:isDark?'rgba(148,163,184,0.10)':'#f1f5f9',b:isDark?'rgba(148,163,184,0.20)':'#cbd5e1'}, trash:{c:isDark?'#f87171':'#dc2626',bg:isDark?'rgba(248,113,113,0.10)':'#fff1f2',b:isDark?'rgba(248,113,113,0.25)':'#fecaca'} }[s]||{c:T.muted,bg:T.tagBg,b:T.tagBord});
  const pColor = p => p==='high'?'#f43f5e':p==='medium'?'#fbbf24':'#10b981';
  const pLabel = p => p==='high'?'#f87171':p==='medium'?'#fbbf24':'#34d399';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: T.bg }}>
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-medium" style={{ background:T.cardBg, border:`1px solid ${T.cardBord}`, color:T.muted }}>
        <Loader2 size={16} className="animate-spin" style={{ color:'#a78bfa' }}/> Loading report...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6 lg:p-8" style={{ background: T.bg, fontFamily:"'DM Sans',system-ui,sans-serif" }}>

      <div className="flex items-center justify-between mb-7">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-1.5" style={{ color:'#a78bfa' }}>Workspace</p>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight m-0" style={{ color: T.head }}>Reports</h1>
            <span className="text-xs rounded-full px-3.5 py-1.5" style={{ color:T.muted, background:T.tagBg, border:`1px solid ${T.tagBord}` }}>{total} total tasks</span>
          </div>
          <p className="text-sm mt-1" style={{ color: T.sub }}>Analytics and insights for your team</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>exportToExcel(tasks,'tasks-report.xlsx')} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl cursor-pointer border" style={{ background:T.cardBg, borderColor:T.cardBord, color:T.body }}>
            <FileSpreadsheet size={14} style={{ color:'#34d399' }}/> Export Excel
          </button>
          <button onClick={()=>exportToPDF(tasks,'tasks-report')} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-xl cursor-pointer border-none" style={{ background:'#7c3aed', boxShadow:'0 4px 14px rgba(124,58,237,0.30)' }}>
            <FileText size={14}/> Export PDF
          </button>
        </div>
      </div>

      <section className="mb-7">
        <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: T.muted }}>Summary</p>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          {[
            {icon:BarChart3,  label:'Total',      val:total,      sub:`${completionRate}% done`, c:'#a78bfa', bg:isDark?'rgba(139,92,246,0.10)':'#ede9fe', b:isDark?'rgba(139,92,246,0.20)':'#c4b5fd'},
            {icon:CheckCircle,label:'Completed',  val:completed,  sub:`of ${total}`,            c:'#34d399', bg:isDark?'rgba(52,211,153,0.10)':'#d1fae5', b:isDark?'rgba(52,211,153,0.20)':'#6ee7b7'},
            {icon:Clock,      label:'In Progress',val:inProgress, sub:'actively working',       c:'#38bdf8', bg:isDark?'rgba(56,189,248,0.10)':'#e0f2fe', b:isDark?'rgba(56,189,248,0.20)':'#7dd3fc'},
            {icon:ListTodo,   label:'Todo',       val:todo,       sub:'not started',            c:isDark?'#94a3b8':'#64748b', bg:T.tagBg, b:T.tagBord},
            {icon:Trash2,     label:'Trash',      val:trash,      sub:'discarded',              c:'#f87171', bg:isDark?'rgba(248,113,113,0.10)':'#fff1f2', b:isDark?'rgba(248,113,113,0.20)':'#fecaca'},
          ].map(({icon:Icon,label,val,sub,c,bg,b})=>(
            <div key={label} className="relative rounded-2xl p-5 overflow-hidden" style={{ background:T.cardBg, border:`1px solid ${T.cardBord}` }}>
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background:c, opacity:0.7 }} />
              <span className="flex items-center gap-1.5 text-[11px] font-semibold mb-2" style={{ color:c }}>
                <Icon size={11}/> {label}
              </span>
              <p className="text-3xl font-extrabold m-0 leading-none" style={{ color:c }}>{val}</p>
              <p className="text-[11px] mt-1 m-0" style={{ color:T.muted }}>{sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
        <div className="rounded-2xl p-6" style={{ background:T.cardBg, border:`1px solid ${T.cardBord}` }}>
          <p className="text-[11px] font-bold uppercase tracking-widest mb-5" style={{ color:T.muted }}>Completion Rate</p>
          <div className="flex items-center gap-8">
            <div className="relative shrink-0" style={{ width:110, height:110 }}>
              <svg viewBox="0 0 36 36" style={{ width:110, height:110, transform:'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke={isDark?'rgba(255,255,255,0.06)':'#e2e8f0'} strokeWidth="2.5"/>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#gr1)" strokeWidth="2.5"
                  strokeDasharray={`${completionRate} ${100-completionRate}`} strokeLinecap="round"/>
                <defs><linearGradient id="gr1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#8b5cf6"/><stop offset="100%" stopColor="#6366f1"/></linearGradient></defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xl font-extrabold" style={{ color:T.head }}>{completionRate}%</span>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-violet-500 shrink-0"/><span className="text-sm font-medium" style={{ color:T.body }}>{completed} completed</span></div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full shrink-0" style={{ background:isDark?'rgba(255,255,255,0.15)':'#e2e8f0' }}/><span className="text-sm" style={{ color:T.muted }}>{total-completed} remaining</span></div>
              <span className="text-xs" style={{ color:T.muted }}>{total} total tasks</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ background:T.cardBg, border:`1px solid ${T.cardBord}` }}>
          <p className="text-[11px] font-bold uppercase tracking-widest mb-5 flex items-center gap-2" style={{ color:T.muted }}>
            <AlertTriangle size={11} style={{ color:'#fbbf24' }}/> Priority Breakdown
          </p>
          <div className="flex flex-col gap-4">
            {[{label:'High',count:high,color:'#f43f5e',tc:'#f87171'},{label:'Medium',count:medium,color:'#fbbf24',tc:'#fbbf24'},{label:'Low',count:low,color:'#10b981',tc:'#34d399'}].map(({label,count,color,tc})=>(
              <div key={label} className="flex items-center gap-3">
                <span className="text-xs font-bold w-14" style={{ color:tc }}>{label}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background:T.barTrack }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ background:color, width:`${total>0?(count/total)*100:0}%` }}/>
                </div>
                <span className="text-xs font-bold w-5 text-right" style={{ color:T.body }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-7">
        <p className="text-[11px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color:T.muted }}>
          <Users size={11}/> Tasks by Assignee
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tasksByAssignee.map(({assignee,total:at,completed:ac,inProgress:ai,todo:ato})=>{
            const rate = at>0?Math.round((ac/at)*100):0;
            return (
              <div key={assignee} className="rounded-2xl p-5 flex flex-col gap-3" style={{ background:T.cardBg, border:`1px solid ${T.cardBord}` }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background:'rgba(139,92,246,0.15)', color:'#a78bfa', border:'1px solid rgba(139,92,246,0.25)' }}>
                    {assignee?assignee.slice(0,2).toUpperCase():'?'}
                  </div>
                  <span className="text-sm font-bold" style={{ color:T.head }}>{assignee}</span>
                  <span className="ml-auto text-xs rounded-full px-2.5 py-1" style={{ color:T.muted, background:T.tagBg, border:`1px solid ${T.tagBord}` }}>{at} tasks</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background:T.barTrack }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ background:'linear-gradient(90deg,#8b5cf6,#6366f1)', width:`${rate}%` }}/>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                  <span className="text-[10px] px-2.5 py-1 rounded-full font-bold" style={{ color:isDark?'#34d399':'#059669', background:isDark?'rgba(52,211,153,0.10)':'#d1fae5', border:`1px solid ${isDark?'rgba(52,211,153,0.20)':'#6ee7b7'}` }}>{ac} done</span>
                  <span className="text-[10px] px-2.5 py-1 rounded-full font-bold" style={{ color:isDark?'#a78bfa':'#7c3aed', background:isDark?'rgba(139,92,246,0.10)':'#ede9fe', border:`1px solid ${isDark?'rgba(139,92,246,0.20)':'#c4b5fd'}` }}>{ai} active</span>
                  <span className="text-[10px] px-2.5 py-1 rounded-full font-bold" style={{ color:T.muted, background:T.tagBg, border:`1px solid ${T.tagBord}` }}>{ato} todo</span>
                  <span className="ml-auto text-[10px] font-extrabold" style={{ color:'#a78bfa' }}>{rate}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color:T.muted }}>Recent Tasks</p>
        <div className="rounded-2xl overflow-hidden" style={{ background:T.cardBg, border:`1px solid ${T.cardBord}` }}>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background:T.thBg, borderBottom:`1px solid ${T.divider}` }}>
                {['Title','Priority','Status','Assignee','Due'].map(h=>(
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color:T.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTasks.map(task=>{
                const sb = statusBadge(task.status);
                return (
                  <tr key={task.id} className="transition-colors duration-150" style={{ borderTop:`1px solid ${T.divider}` }}
                    onMouseEnter={e=>e.currentTarget.style.background=T.rowHov}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td className="px-5 py-3.5 font-bold" style={{ color:T.head }}>{task.title}</td>
                    <td className="px-5 py-3.5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background:T.tagBg, border:`1px solid ${T.tagBord}` }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background:pColor(task.priority) }}/>
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color:pLabel(task.priority) }}>{task.priority}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide" style={{ color:sb.c, background:sb.bg, border:`1px solid ${sb.b}` }}>{task.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background:'rgba(139,92,246,0.15)', color:'#a78bfa', border:'1px solid rgba(139,92,246,0.25)' }}>
                        {task.assignee?task.assignee.slice(0,2).toUpperCase():'?'}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs" style={{ color:T.muted }}>{formatDate(task.due)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}