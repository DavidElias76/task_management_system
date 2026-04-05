import { useState, useContext } from 'react';
import { Search, Pencil, Trash2 } from 'lucide-react';
import TaskModal from '../components/Modals/TaskModal';
import TaskPanel from '../components/Panels/TasksPanel.jsx';
import { TasksContext } from '../context/TasksContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { ThemeContext } from '../context/ThemeContext.jsx';
import useDebounce from '../hooks/UsersDebounce.js';
import TopNotification from '../components/layout/Notification.jsx';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export default function Tasks() {
  const { tasks, error, refetch } = useContext(TasksContext);
  const { user }  = useContext(AuthContext);
  const { isDark, T } = useContext(ThemeContext);
  const [isTaskOpen, setIsTaskOpen]  = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeTask, setActiveTask]  = useState(null);
  const [notification, setNotification] = useState(false)

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const isPrivileged = ['manager','admin'].includes(user?.role?.toLowerCase());
  const isUser = user?.role?.toLowerCase() === 'user';
  const allTasks = isPrivileged ? tasks : tasks.filter(t => t.assignee === user?.username);

  const filteredTasks = allTasks.filter(task => {
    const term = debouncedSearch.toLowerCase();
    return task.title.toLowerCase().includes(term)
      || task.status.toLowerCase().includes(term)
      || task.priority.toLowerCase().includes(term)
      || task.assignee.toLowerCase().includes(term);
  });

  const handleEdit = t => { setEditingTask(t); setIsTaskOpen(true);};

  const handleDelete = async id => {
    if (!window.confirm('Delete this task?')) return;
    try { await axios.delete(`${BASE_URL}/api/tasks/${id}`, { withCredentials: true }); refetch(); setNotification("Task deleted sucessfully")}
    catch(e) { console.error(e); }
  };
  const handleTaskClick = (t) => isUser ? setActiveTask(t) : handleEdit(t);

  const handleTaskUpdated = (u) => { 
    refetch();
    if (u._notify) setNotification(u._notify);
    u.status === 'completed' ? setActiveTask(null) : setActiveTask(u); 
  };

  const priorityColor = p => p==='high'?'#f43f5e':p==='medium'?'#fbbf24':'#10b981';
  const priorityLabel = p => p==='high'?'#f87171':p==='medium'?'#fbbf24':'#34d399';
  const statusToken   = s => isDark
    ? { completed:{c:'#34d399',bg:'rgba(52,211,153,0.10)',b:'rgba(52,211,153,0.25)'}, 'in-progress':{c:'#a78bfa',bg:'rgba(139,92,246,0.10)',b:'rgba(139,92,246,0.25)'}, todo:{c:'#94a3b8',bg:'rgba(148,163,184,0.10)',b:'rgba(148,163,184,0.20)'}, trash:{c:'#f87171',bg:'rgba(248,113,113,0.10)',b:'rgba(248,113,113,0.25)'} }[s]
    : { completed:{c:'#059669',bg:'#d1fae5',b:'#6ee7b7'}, 'in-progress':{c:'#7c3aed',bg:'#ede9fe',b:'#c4b5fd'}, todo:{c:'#64748b',bg:'#f1f5f9',b:'#cbd5e1'}, trash:{c:'#dc2626',bg:'#fff1f2',b:'#fecaca'} }[s];

  if (activeTask) return (
    <TaskPanel 
        task={activeTask} 
        currentUser={user} 
        onBack={() => setActiveTask(null)} 
        onTaskUpdated={handleTaskUpdated} 
    />
  );

  return (
    <div className="min-h-screen p-6 lg:p-8" style={{ background: T.bg, fontFamily: "'DM Sans',system-ui,sans-serif" }}>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium" style={{ border:'1px solid rgba(248,113,113,0.3)', background:'rgba(248,113,113,0.08)', color:'#f87171' }}>
          {error}
        </div>
      )}

      {notification && ( <TopNotification message={notification} onClose={() => setNotification("")}/>)}     

      <div className="mb-7 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-1.5" style={{ color:'#a78bfa' }}>Workspace</p>
          <h1 className="text-3xl font-extrabold tracking-tight m-0" style={{ color: T.head }}>Tasks Board</h1>
          <p className="text-sm mt-1" style={{ color: T.sub }}>Track and manage your team's tasks</p>
        </div>

        {isPrivileged && (
          <div className="flex items-center gap-2.5">
            <span className="text-xs rounded-full px-3.5 py-1.5" style={{ color: T.muted, background: T.tagBg, border:`1px solid ${T.tagBord}` }}>
              {filteredTasks.length} tasks
            </span>
            <button
              onClick={() => { setEditingTask(null); setIsTaskOpen(true); }}
              className="flex items-center gap-1.5 px-4 py-3 text-sm font-bold text-white rounded-xl cursor-pointer border-none"
              style={{ background:'#7c3aed', boxShadow:'0 4px 14px rgba(124,58,237,0.35)' }}
            >+ Add Task
            </button>
          </div>
        )}
      </div>

      <TaskModal
        key={editingTask ? editingTask.id : 'new'}
        isOpen={isTaskOpen}
        onClose={() => { setIsTaskOpen(false); setEditingTask(null); }}
        onTaskAdded={() => { refetch(); setNotification('Task added successfully'); }}
        onTaskEdited ={() => {refetch(); setNotification('Task edited successfuly')}}
        task={editingTask}
      />

      <div className="mb-6 flex items-center gap-2.5">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.muted }} />
          <input
            type="text"
            placeholder="Search by title, status, assignee..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl text-sm outline-none"
            style={{ background: T.inputBg, border:`1px solid ${T.inputBord}`, color: T.head }}
          />
        </div>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 list-none p-0 m-0">
        {filteredTasks.map(task => {
          const st = statusToken(task.status) || statusToken('todo');
          return (
            <li key={task.id}
              className="flex flex-col rounded-xl overflow-hidden transition-all duration-150"
              style={{ background: T.cardBg, border:`1px solid ${T.cardBord}` }}
              onMouseEnter={e => { e.currentTarget.style.border=`1px solid ${isDark?'rgba(139,92,246,0.35)':'#c4b5fd'}`; e.currentTarget.style.background=isDark?'rgba(255,255,255,0.07)':'#f8fafc'; }}
              onMouseLeave={e => { e.currentTarget.style.border=`1px solid ${T.cardBord}`; e.currentTarget.style.background=T.cardBg; }}
            >
              <div className="h-0.5 w-full" style={{ background: priorityColor(task.priority) }} />

              <div className="flex flex-col gap-3 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: T.tagBg, border:`1px solid ${T.tagBord}` }}>
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: priorityColor(task.priority) }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: priorityLabel(task.priority) }}>{task.priority}</span>
                  </div>
                  <span className="text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wide" style={{ color:st.c, background:st.bg, border:`1px solid ${st.b}` }}>
                    {task.status}
                  </span>
                </div>

                <p className="text-sm font-bold leading-snug m-0" style={{ color: T.head }}>{task.title}</p>

                {task.description && (
                  <p className="text-xs leading-relaxed m-0 line-clamp-2" style={{ color: T.muted }}>{task.description}</p>
                )}

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background:'rgba(124,58,237,0.20)', color:'#a78bfa', border:'1px solid rgba(124,58,237,0.30)' }}>
                    {task.assignee ? task.assignee.slice(0,2).toUpperCase() : '?'}
                  </div>
                  <span className="text-xs font-semibold truncate" style={{ color: T.body }}>{task.assignee || 'Unassigned'}</span>
                  {task.category && (
                    <span className="text-[11px] px-2 py-0.5 rounded-lg ml-auto shrink-0" style={{ color: T.muted, background: T.tagBg, border:`1px solid ${T.tagBord}` }}>{task.category}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px]" style={{ color: T.muted }}>
                  {task.due && <span className="px-2 py-0.5 rounded-lg" style={{ background: T.tagBg, border:`1px solid ${T.tagBord}` }}>Due: {new Date(task.due).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}</span>}
                  {task.estimated_hours && <span className="px-2 py-0.5 rounded-lg ml-auto" style={{ background: T.tagBg, border:`1px solid ${T.tagBord}` }}>Est: {task.estimated_hours}</span>}
                </div>

                {task.created_by && <p className="text-[11px] m-0" style={{ color: T.muted }}>Created by <span className="font-semibold" style={{ color: T.body }}>{task.created_by}</span></p>}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleTaskClick(task)}
                    disabled={isUser && task.status === 'completed'}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl border"
                    style={{
                      color: isUser && task.status === 'completed' ? T.muted : '#a78bfa',
                      background: isUser && task.status === 'completed'
                        ? T.tagBg
                        : isDark ? 'rgba(139,92,246,0.10)' : '#ede9fe',
                      borderColor: isUser && task.status === 'completed'
                        ? T.tagBord
                        : isDark ? 'rgba(139,92,246,0.25)' : '#c4b5fd',
                      cursor: isUser && task.status === 'completed' ? 'not-allowed' : 'pointer',
                      opacity: isUser && task.status === 'completed' ? 0.5 : 1,
                    }}
                    >
                    <Pencil size={11} /> {isUser ? 'Start Task' : 'Edit Task'}
                  </button>
                  {isPrivileged && (
                    <button onClick={() => handleDelete(task.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl cursor-pointer border" style={{ color:'#f87171', background:isDark?'rgba(248,113,113,0.08)':'#fff1f2', borderColor:isDark?'rgba(248,113,113,0.20)':'#fecaca' }}>
                      <Trash2 size={11}/> Delete
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {filteredTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 gap-2">
          <Search size={22} style={{ color: T.muted }} />
          <p className="text-sm font-semibold m-0" style={{ color: T.body }}>No tasks found</p>
          <p className="text-xs m-0" style={{ color: T.muted }}>Try adjusting your search</p>
        </div>
      )}
    </div>
  );
}