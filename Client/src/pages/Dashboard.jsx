import { CheckCircle, Clock, UsersRound, ListTodo, AlertTriangle, Loader2, TrendingUp } from 'lucide-react';
import { TasksContext } from '../context/TasksContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { useContext, useEffect, useState } from 'react';
import { formatUsername } from '../utils/ExportInitials.js';
import { formatDate, isOverdue, isToday, pColor, pLabel } from '../utils/dashboard.js';

const R = '12px';
const CARD = (T, isDark, extra = {}) => ({
  background: T.cardBg,
  border: `1px solid ${T.cardBord}`,
  borderRadius: R,
  boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.35)' : '0 2px 12px rgba(0,0,0,0.07)',
  ...extra,
});

function PriorityBreakdown({ tasks, T }) {
  const h = tasks.filter(t => t.priority === 'high').length;
  const m = tasks.filter(t => t.priority === 'medium').length;
  const l = tasks.filter(t => t.priority === 'low').length;
  const total = tasks.length || 1;
  const bars = [
    { label: 'High', count: h, color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
    { label: 'Medium', count: m, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
    { label: 'Low', count: l, color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
  ];
  return (
    <div className="flex flex-col gap-3.5">
      {bars.map(({ label, count, color, bg }) => (
        <div key={label} className="flex items-center gap-3">
          <span className="text-[11px] font-bold w-14 shrink-0" style={{ color }}>{label}</span>
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: T.barTrack }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ background: color, width: `${Math.round((count / total) * 100)}%` }} />
          </div>
          <div className="w-7 h-7 flex items-center justify-center text-xs font-black rounded-lg shrink-0"
            style={{ background: bg, color }}>{count}</div>
        </div>
      ))}
    </div>
  );
}

function AssigneeBreakdown({ tasks, T }) {
  const map = {};
  tasks.forEach(t => {
    if (!t.assignee) return;
    if (!map[t.assignee]) map[t.assignee] = { total: 0, completed: 0 };
    map[t.assignee].total++;
    if (t.status === 'completed') map[t.assignee].completed++;
  });
  const entries = Object.entries(map);
  if (!entries.length) return <p className="text-xs" style={{ color: T.muted }}>No assignees yet.</p>;

  const half = Math.ceil(entries.length / 2);
  const col1 = entries.slice(0, half);
  const col2 = entries.slice(half);

  const Row = ([name, s]) => {
    const rate = s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0;
    return (
      <div key={name} className="flex flex-col gap-1.5 py-2.5 px-3"
        style={{ borderBottom: `1px solid ${T.divider}` }}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 flex items-center justify-center text-[10px] font-black shrink-0"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', borderRadius: '6px' }}>
              {name.slice(0, 1).toUpperCase()}
            </div>
            <span className="text-xs font-semibold truncate" style={{ color: T.head, maxWidth: '80px' }}>{name}</span>
          </div>
          <span className="text-[10px] font-black tabular-nums shrink-0" style={{ color: '#6366f1' }}>{rate}%</span>
        </div>
        <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: T.barTrack }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ background: rate === 100 ? '#10b981' : 'linear-gradient(90deg,#6366f1,#a78bfa)', width: `${rate}%` }} />
        </div>
        <span className="text-[10px]" style={{ color: T.muted }}>{s.completed}/{s.total} completed</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-0 overflow-hidden" style={{ borderRadius: '8px', border: `1px solid ${T.divider}` }}>
      <div className="flex flex-col" style={{ borderRight: `1px solid ${T.divider}` }}>{col1.map(Row)}</div>
      <div className="flex flex-col">{col2.map(Row)}</div>
    </div>
  );
}

export default function Dashboard() {
  const { tasks, loading, users, refetch } = useContext(TasksContext);
  const { user } = useContext(AuthContext);
  const { isDark, T } = useContext(ThemeContext);
  
  const role = user?.role?.toLowerCase() || "";
  const isPrivileged = ['manager', 'admin'].includes(role);
  const isUser = role === 'user';

  const workspaceTitle = role === 'admin' ? 'Admin View' : role === 'manager' ? 'Manager View' : 'My Workspace';

  const myTasks = isUser
    ? tasks.filter(t => t.assignee === user?.username)
    : tasks;

  const total = myTasks.length;
  const completedTasks = myTasks.filter(t => t.status === 'completed').length;
  const inProgress = myTasks.filter(t => t.status === 'in-progress').length;
  const todo = myTasks.filter(t => t.status === 'todo').length;
  const completionRate = total > 0 ? Math.round((completedTasks / total) * 100) : 0;
  const dueTodayTasks = myTasks.filter(t => isToday(t.due) && t.status !== 'completed');
  const overdueTasks  = myTasks.filter(t => isOverdue(t.due) && t.status !== 'completed' && t.status !== 'trash');
  const recentTasks = [...myTasks].slice(0, 5);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const statCards = [
    { icon: ListTodo, label: 'To-Do', value: todo, accent: '#6366f1', glow: 'rgba(99,102,241,0.15)',   trend: `${todo} pending`, dir: 'neutral', sub: 'tasks remaining'   },
    { icon: Clock, label: 'In Progress', value: inProgress, accent: '#06b6d4', glow: 'rgba(6,182,212,0.15)',    trend: `${inProgress} active`, dir: 'up', sub: 'being worked on'   },
    { icon: CheckCircle, label: 'Completed', value: completedTasks, accent: '#10b981', glow: 'rgba(16,185,129,0.15)',   trend: `${completionRate}%`, dir: completionRate >= 50 ? 'up' : 'down', sub: 'completion rate' },
    { icon: TrendingUp, label: 'Due Today', value: dueTodayTasks.length, accent: '#f59e0b', glow: 'rgba(245,158,11,0.15)', trend: dueTodayTasks.length === 0 ? 'All clear' : `${dueTodayTasks.length} due`, dir: dueTodayTasks.length === 0 ? 'up' : 'neutral', sub: 'due today' },
    { icon: AlertTriangle, label: 'Overdue', value: overdueTasks.length,  accent: '#ef4444', glow: 'rgba(239,68,68,0.15)',  trend: overdueTasks.length === 0 ? 'On track' : `${overdueTasks.length} late`,  dir: overdueTasks.length === 0 ? 'up' : 'down',    sub: 'need attention' },

    ...(isPrivileged
      ? [{ icon: UsersRound, label: 'Team Members', value: users.length, accent: '#8b5cf6', glow: 'rgba(139,92,246,0.15)', trend: `${users.length} members`, dir: 'up', sub: 'active members' }]
      : [{ icon: ListTodo,   label: 'Total Tasks',  value: total,        accent: '#8b5cf6', glow: 'rgba(139,92,246,0.15)', trend: `${total} assigned`,       dir: 'neutral', sub: 'assigned to you' }]
    ),
  ];

  const statusBadge = s => ({
    completed: { c: isDark ? '#34d399' : '#059669', bg: isDark ? 'rgba(52,211,153,0.12)'  : '#d1fae5', b: isDark ? 'rgba(52,211,153,0.25)'  : '#6ee7b7' },
    'in-progress':{ c: '#6366f1', bg: isDark ? 'rgba(99,102,241,0.12)'  : '#e0e7ff', b: isDark ? 'rgba(99,102,241,0.25)'  : '#a5b4fc' },
    todo: { c: T.muted,  bg: T.tagBg, b: T.tagBord },
    trash: { c: '#ef4444', bg: isDark ? 'rgba(239,68,68,0.12)' : '#fff1f2', b: isDark ? 'rgba(239,68,68,0.25)'   : '#fecaca' },
  }[s] || { c: T.muted, bg: T.tagBg, b: T.tagBord });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: T.bg }}>
      <div className="flex items-center gap-3 px-6 py-3.5 text-sm font-medium"
        style={{ background: T.cardBg, border: `1px solid ${T.cardBord}`, borderRadius: R, color: T.muted }}>
        <Loader2 size={16} className="animate-spin" style={{ color: '#6366f1' }} /> Loading dashboard...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ background: T.bg, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex items-center gap-1">
              <div style={{ width: 4, height: 20, background: '#6366f1', borderRadius: '99px' }} />
              <div style={{ width: 4, height: 14, background: '#8b5cf6', borderRadius: '99px' }} />
              <div style={{ width: 4, height: 8,  background: '#a78bfa', borderRadius: '99px' }} />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] m-0" style={{ color: '#6366f1' }}>{workspaceTitle}</p>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none m-0" style={{ color: T.head }}>
            Welcome back,{' '}
            <span style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {formatUsername(user?.username)}
            </span>
          </h1>
          <p className="text-sm mt-2" style={{ color: T.sub }}>{today}</p>
        </div>
      </div>

      <section className="mb-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map(({ icon: Icon, label, value, trend, dir, sub, accent, glow }) => (
          <div key={label}
            className="flex flex-col p-4 transition-all duration-200 cursor-default"
            style={{ ...CARD(T, isDark), borderTop: `3px solid ${accent}`, position: 'relative', overflow: 'hidden' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = isDark ? `0 8px 30px rgba(0,0,0,0.4),0 0 0 1px ${accent}40` : `0 8px 24px rgba(0,0,0,0.10),0 0 0 1px ${accent}30`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isDark ? '0 4px 20px rgba(0,0,0,0.35)' : '0 2px 12px rgba(0,0,0,0.07)'; }}
          >
            <div style={{ position: 'absolute', top: -20, right: -20, width: 70, height: 70, background: glow, borderRadius: '50%', filter: 'blur(18px)', pointerEvents: 'none' }} />
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] m-0" style={{ color: T.muted }}>{label}</p>
              <div className="w-7 h-7 flex items-center justify-center" style={{ background: glow, borderRadius: '8px', border: `1px solid ${accent}30` }}>
                <Icon size={13} style={{ color: accent }} />
              </div>
            </div>
            <p className="text-2xl font-black m-0 mb-2 tabular-nums leading-none" style={{ color: T.head }}>{value}</p>
            <div className="flex items-center gap-1.5 mt-auto">
              {dir === 'up'      && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
              {dir === 'down'    && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>}
              {dir === 'neutral' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>}
              <span className="text-[11px] font-bold" style={{ color: dir === 'up' ? '#10b981' : dir === 'down' ? '#ef4444' : T.muted }}>{trend}</span>
              <span className="text-[11px]" style={{ color: T.muted }}>{sub}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5">
        <div className="flex flex-col gap-3">
          <div className="p-5" style={CARD(T, isDark, { borderTop: `3px solid #6366f1` })}>
            <div className="flex items-center gap-2 mb-5">
              <div style={{ width: 3, height: 16, background: 'linear-gradient(180deg,#6366f1,#8b5cf6)', borderRadius: '99px' }} />
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] m-0" style={{ color: T.muted }}>
                {isUser ? 'My Completion Rate' : 'Completion Rate'}
              </p>
            </div>
            <div className="flex items-center gap-8">
              <div className="relative shrink-0" style={{ width: 100, height: 100 }}>
                <svg viewBox="0 0 36 36" style={{ width: 100, height: 100, transform: 'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke={isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'} strokeWidth="2.5" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#cgr)" strokeWidth="2.5"
                    strokeDasharray={`${completionRate} ${100 - completionRate}`} strokeLinecap="round" />
                  <defs>
                    <linearGradient id="cgr" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xl font-black" style={{ color: T.head }}>{completionRate}%</span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <div style={{ width: 10, height: 10, background: 'linear-gradient(135deg,#6366f1,#06b6d4)', borderRadius: '3px' }} />
                  <span className="text-sm font-semibold" style={{ color: T.body }}>{completedTasks} completed</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div style={{ width: 10, height: 10, background: T.barTrack, borderRadius: '3px' }} />
                  <span className="text-sm" style={{ color: T.muted }}>{total - completedTasks} remaining</span>
                </div>
                <span className="text-xs px-2.5 py-1 font-semibold" style={{ color: '#6366f1', background: isDark ? 'rgba(99,102,241,0.12)' : '#e0e7ff', borderRadius: '6px' }}>{total} total tasks</span>
              </div>
            </div>
          </div>

          <div className="p-5" style={CARD(T, isDark, { borderTop: `3px solid #f59e0b` })}>
            <div className="flex items-center gap-2 mb-5">
              <div style={{ width: 3, height: 16, background: 'linear-gradient(180deg,#f59e0b,#ef4444)', borderRadius: '99px' }} />
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] m-0" style={{ color: T.muted }}>
                {isUser ? 'My Priority Split' : 'Priority Split'}
              </p>
              <span className="ml-auto text-[10px] font-bold px-2.5 py-1"
                style={{ color: '#f59e0b', background: isDark ? 'rgba(245,158,11,0.12)' : '#fef3c7', borderRadius: '6px', border: `1px solid ${isDark ? 'rgba(245,158,11,0.2)' : '#fcd34d'}` }}>
                {total} tasks
              </span>
            </div>
            <PriorityBreakdown tasks={myTasks} T={T} />
          </div>
        </div>

        <div className="p-5 flex flex-col" style={CARD(T, isDark, { borderTop: `3px solid #06b6d4` })}>
          <div className="flex items-center gap-2 mb-5">
            <div style={{ width: 3, height: 16, background: 'linear-gradient(180deg,#06b6d4,#6366f1)', borderRadius: '99px' }} />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] m-0" style={{ color: T.muted }}>
              {isUser ? 'My Progress' : 'Team Progress'}
            </p>
            <span className="ml-auto text-[10px] font-bold px-2.5 py-1"
              style={{ color: '#06b6d4', background: isDark ? 'rgba(6,182,212,0.12)' : '#e0f2fe', borderRadius: '6px', border: `1px solid ${isDark ? 'rgba(6,182,212,0.2)' : '#7dd3fc'}` }}>
              {isUser ? 'by status' : 'by assignee'}
            </span>
          </div>

          {isUser ? (
            <div className="flex flex-col gap-3">
              {[
                { label: 'Completed',   count: completedTasks, color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
                { label: 'In Progress', count: inProgress,     color: '#06b6d4', bg: 'rgba(6,182,212,0.12)'   },
                { label: 'To-Do',       count: todo,           color: '#6366f1', bg: 'rgba(99,102,241,0.12)'  },
                { label: 'Overdue',     count: overdueTasks.length, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
              ].map(({ label, count, color, bg }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-[11px] font-bold w-20 shrink-0" style={{ color }}>{label}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: T.barTrack }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ background: color, width: total > 0 ? `${Math.round((count / total) * 100)}%` : '0%' }} />
                  </div>
                  <div className="w-7 h-7 flex items-center justify-center text-xs font-black rounded-lg shrink-0"
                    style={{ background: bg, color }}>{count}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1">
              <AssigneeBreakdown tasks={myTasks} T={T} isDark={isDark} />
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        <div className="p-5" style={CARD(T, isDark, { borderTop: `3px solid #6366f1` })}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div style={{ width: 3, height: 16, background: '#6366f1', borderRadius: '99px' }} />
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] m-0" style={{ color: T.muted }}>
                {isUser ? 'My Due Today' : 'Due Today'}
              </p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1"
              style={{ color: '#6366f1', background: isDark ? 'rgba(99,102,241,0.12)' : '#e0e7ff', borderRadius: '6px', border: `1px solid ${isDark ? 'rgba(99,102,241,0.2)' : '#a5b4fc'}` }}>
              {dueTodayTasks.length} tasks
            </span>
          </div>
          {dueTodayTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-24 gap-1.5">
              <div className="w-8 h-8 flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.12)', borderRadius: '10px' }}>
                <CheckCircle size={16} style={{ color: '#10b981' }} />
              </div>
              <p className="text-sm font-bold m-0" style={{ color: T.body }}>All clear!</p>
              <p className="text-xs m-0" style={{ color: T.muted }}>No tasks due today</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-1.5 list-none p-0 m-0">
              {dueTodayTasks.map(t => (
                <li key={t.id} className="flex items-center gap-3 px-3 py-2.5"
                  style={{ background: T.listItem, border: `1px solid ${T.listBord}`, borderRadius: '8px' }}>
                  <div style={{ width: 3, height: 16, background: pColor(t.priority), borderRadius: '99px', flexShrink: 0 }} />
                  <span className="text-sm font-medium flex-1 truncate" style={{ color: T.body }}>{t.title}</span>
                  {isPrivileged && <span className="text-[10px] px-2 py-0.5 font-semibold"
                    style={{ color: T.muted, background: T.tagBg, borderRadius: '5px' }}>{t.assignee}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-5" style={CARD(T, isDark, { borderTop: `3px solid #ef4444`, background: isDark ? 'rgba(239,68,68,0.04)' : '#fff9f9', border: `1px solid ${isDark ? 'rgba(239,68,68,0.15)' : '#fecaca'}` })}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div style={{ width: 3, height: 16, background: '#ef4444', borderRadius: '99px' }} />
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] m-0 flex items-center gap-1.5" style={{ color: T.muted }}>
                <AlertTriangle size={11} style={{ color: '#ef4444' }} />
                {isUser ? 'My Overdue' : 'Overdue'}
              </p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1"
              style={{ color: '#ef4444', background: isDark ? 'rgba(239,68,68,0.12)' : '#fff1f2', borderRadius: '6px', border: `1px solid ${isDark ? 'rgba(239,68,68,0.2)' : '#fecaca'}` }}>
              {overdueTasks.length} tasks
            </span>
          </div>
          {overdueTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-24 gap-1.5">
              <div className="w-8 h-8 flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.12)', borderRadius: '10px' }}>
                <CheckCircle size={16} style={{ color: '#10b981' }} />
              </div>
              <p className="text-sm font-bold m-0" style={{ color: T.body }}>All on track!</p>
              <p className="text-xs m-0" style={{ color: T.muted }}>No overdue tasks</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-1.5 list-none p-0 m-0">
              {overdueTasks.map(t => (
                <li key={t.id} className="flex items-center gap-3 px-3 py-2.5"
                  style={{ background: isDark ? 'rgba(239,68,68,0.06)' : '#fff1f2', border: `1px solid ${isDark ? 'rgba(239,68,68,0.12)' : '#fecaca'}`, borderRadius: '8px' }}>
                  <div style={{ width: 3, height: 16, background: pColor(t.priority), borderRadius: '99px', flexShrink: 0 }} />
                  <span className="text-sm font-medium flex-1 truncate" style={{ color: T.body }}>{t.title}</span>
                  <span className="text-xs font-bold shrink-0" style={{ color: '#ef4444' }}>{formatDate(t.due)}</span>
                  {isPrivileged && <span className="text-[10px] shrink-0 ml-1" style={{ color: T.muted }}>{t.assignee}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2.5 mb-3">
          <div style={{ width: 3, height: 16, background: 'linear-gradient(180deg,#6366f1,#8b5cf6)', borderRadius: '99px' }} />
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] m-0" style={{ color: T.muted }}>
            {isUser ? 'My Recent Activity' : 'Recent Activity'}
          </p>
          <span className="ml-auto text-[10px] font-semibold px-2.5 py-1"
            style={{ color: T.muted, background: T.tagBg, border: `1px solid ${T.tagBord}`, borderRadius: '6px' }}>
            {recentTasks.length} tasks
          </span>
        </div>
        <div style={CARD(T, isDark, { overflow: 'hidden' })}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: T.thBg, borderBottom: `1px solid ${T.divider}` }}>
                  {['Title', 'Priority', 'Status', ...(isPrivileged ? ['Assignee'] : []), 'Due', 'Description', 'Category', 'Est. Hours'].map(h => (
                    <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider whitespace-nowrap"
                      style={{ color: T.muted }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentTasks.map(task => {
                  const sb = statusBadge(task.status);
                  return (
                    <tr key={task.id} className="transition-colors duration-150"
                      style={{ borderTop: `1px solid ${T.divider}` }}
                      onMouseEnter={e => e.currentTarget.style.background = T.rowHov}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td className="px-4 py-3.5 font-bold whitespace-nowrap" style={{ color: T.head }}>{task.title}</td>
                      <td className="px-4 py-3.5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1"
                          style={{ background: T.tagBg, border: `1px solid ${T.tagBord}`, borderRadius: '6px' }}>
                          <div style={{ width: 6, height: 6, background: pColor(task.priority), borderRadius: '50%' }} />
                          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: pLabel(task.priority) }}>{task.priority}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[10px] px-2.5 py-1 font-bold uppercase tracking-wide"
                          style={{ color: sb.c, background: sb.bg, border: `1px solid ${sb.b}`, borderRadius: '6px' }}>
                          {task.status}
                        </span>
                      </td>
                      {isPrivileged && (
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 flex items-center justify-center text-[10px] font-bold"
                              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', borderRadius: '8px' }}>
                              {task.assignee ? task.assignee.slice(0, 2).toUpperCase() : '?'}
                            </div>
                            <span className="text-xs truncate" style={{ color: T.body, maxWidth: '80px' }}>{task.assignee}</span>
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: T.muted }}>{formatDate(task.due)}</td>
                      <td className="px-4 py-3.5 text-xs max-w-40 truncate" style={{ color: T.muted }}>{task.description || '—'}</td>
                      <td className="px-4 py-3.5 text-xs" style={{ color: T.muted }}>{task.category || '—'}</td>
                      <td className="px-4 py-3.5 text-xs tabular-nums" style={{ color: T.muted }}>{task.estimated_hours || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}