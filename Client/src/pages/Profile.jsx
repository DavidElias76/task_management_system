import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { TasksContext } from '../context/TasksContext.jsx';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { getInitials } from '../utils/ExportInitials.js';
import { colors } from '../data/data.js';
import {
  CheckCircle, Clock, ListTodo, TrendingUp,
  Mail, Shield, Calendar, Key, Bell, Pencil, Save, X, Eye, EyeOff
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/exportPanel.js';
import toast from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function getAvatarColor(username) {
  if (!username) return [colors[0], colors[0]];
  const c = colors[username.charCodeAt(0) % colors.length];
  return Array.isArray(c) ? c : [c, c];
}

export default function Profile() {
  const { user } = useContext(AuthContext);
  const { tasks } = useContext(TasksContext);
  const { isDark, T } = useContext(ThemeContext);

  const [editingPassword, setEditingPassword] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, overdue: true, assigned: true });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, newPass: false,confirm: false});
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  const initials = getInitials(user?.username);
  const [c1, c2] = getAvatarColor(user?.username);

  const myTasks = tasks.filter(t => t.assignee === user?.username);
  const totalTasks = myTasks.length;
  const completedCount= myTasks.filter(t => t.status === 'completed').length;
  const inProgCount = myTasks.filter(t => t.status === 'in-progress').length;
  const todoCount = myTasks.filter(t => t.status === 'todo').length;
  const completionRate= totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const recentTasks = [...myTasks].slice(0, 5);

  
  const profileUser = {
    id: user?.id || '',
    username: user?.username || 'User',
    email: user?.email || 'No email set',
    role: user?.role || 'user',
    created_at: user?.created_at || user?.createdAt || '',
  };
  
  console.log(profileUser)
  console.log(user)

  const handlePasswordSave = async () => {
    setPwError('');
    if (!passwords.current) return setPwError('Enter your current password.');
    if (passwords.newPass.length < 6) return setPwError('New password must be at least 6 characters.');
    if (passwords.newPass !== passwords.confirm) return setPwError('Passwords do not match.');

    try{
       await axios.put(`${BASE_URL}/api/users/${user.id}`, {
        username: user.username,
        email: user.email,
        password: passwords.newPass,
        role: user.role,
        created_at: user.created_at?.split("T")[0],
      }, { withCredentials: true });

      setPwSuccess('Password updated successfully!');
      toast.success('Password updated successfully')
      setTimeout(() => { setPwSuccess(''); setEditingPassword(false); setPasswords({ current:'', newPass:'', confirm:'' }); }, 2000);

    }catch(error) {
      setPwError('Error updating the new password')
      toast.error("Error updating the new password")
      console.error('Failed to update the password', error)
    }
  };

  const pColor = p => p === 'high' ? '#f43f5e' : p === 'medium' ? '#fbbf24' : '#10b981';
  
  const statusToken = s => ({
    completed: { c: isDark ? '#34d399' : '#059669', bg: isDark ? 'rgba(52,211,153,0.10)' : '#d1fae5', b: isDark ? 'rgba(52,211,153,0.25)' : '#6ee7b7' },
    'in-progress':{ c: isDark ? '#a78bfa' : '#7c3aed', bg: isDark ? 'rgba(139,92,246,0.10)' : '#ede9fe', b: isDark ? 'rgba(139,92,246,0.25)' : '#c4b5fd' },
    todo: { c: isDark ? '#94a3b8' : '#64748b', bg: T.tagBg, b: T.tagBord },
  }[s] || { c: T.muted, bg: T.tagBg, b: T.tagBord });

  const isUser = user?.role?.toLowerCase() === 'user';
  const roleColor = user?.role?.toLowerCase() === 'admin' ? '#a78bfa'
    : user?.role?.toLowerCase() === 'manager' ? '#fbbf24' : '#34d399';

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: 10, fontSize: 13,
    background: T.inputBg, border: `1px solid ${T.inputBord}`,
    color: T.head, outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div className="min-h-screen p-6 lg:p-8" style={{ background: T.bg, fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      <div className="mb-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-1.5" style={{ color: '#a78bfa' }}>Account</p>
        <h1 className="text-3xl font-extrabold tracking-tight m-0" style={{ color: T.head }}>My Profile</h1>
        <p className="text-sm mt-1" style={{ color: T.sub }}>Manage your account details and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl overflow-hidden" style={{ background: T.cardBg, border: `1px solid ${T.cardBord}` }}>
            <div className="h-20 w-full" style={{ background: `linear-gradient(135deg, ${c1}44, ${c2}22)` }} />

            <div className="px-5 pb-5" style={{ marginTop: -28 }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-extrabold mb-3 ring-4"
                style={{ background: `linear-gradient(135deg, ${c1}, ${c2})`, ringColor: T.bg }}>
                {initials}
              </div>

              <h2 className="text-lg font-extrabold m-0 leading-tight" style={{ color: T.head }}>{profileUser?.username || 'User'}</h2>

              <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{ color: roleColor, background: `${roleColor}18`, border: `1px solid ${roleColor}33` }}>
                {user?.role || 'User'}
              </span>

              <div className="mt-4 flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5">
                  <Mail size={13} style={{ color: T.muted, flexShrink: 0 }} />
                  <span className="text-xs truncate" style={{ color: T.body }}>{profileUser?.email || 'No email set'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Shield size={13} style={{ color: T.muted, flexShrink: 0 }} />
                  <span className="text-xs capitalize" style={{ color: T.body }}>{profileUser?.role || 'user'} permissions</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar size={13} style={{ color: T.muted, flexShrink: 0 }} />
                  <span className="text-xs" style={{ color: T.body }}>
                    Joined {profileUser?.created_at ? formatDate(profileUser.created_at) : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: T.cardBg, border: `1px solid ${T.cardBord}` }}>
            <div className="flex items-center gap-2 mb-4">
              <Bell size={14} style={{ color: '#a78bfa' }} />
              <p className="text-[11px] font-bold uppercase tracking-widest m-0" style={{ color: T.muted }}>Notifications</p>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { key: 'email', label: 'Email notifications' },
                { key: 'overdue', label: 'Overdue task alerts' },
                { key: 'assigned', label: 'New task assigned' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: T.body }}>{label}</span>
                  <button
                    onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                    className="relative w-9 h-5 rounded-full transition-all duration-200 border-none cursor-pointer"
                    style={{ background: notifications[key] ? '#7c3aed' : T.tagBg, border: `1px solid ${notifications[key] ? '#7c3aed' : T.tagBord}` }}
                  >
                    <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200"
                      style={{ left: notifications[key] ? '18px' : '2px', boxShadow: '0 1px 4px rgba(0,0,0,0.25)' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="lg:col-span-2 flex flex-col gap-5">
          {isUser && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: ListTodo,    label: 'Total Tasks',  value: totalTasks,     color: '#a78bfa', iconBg: isDark ? 'rgba(139,92,246,0.15)' : '#ede9fe' },
              { icon: CheckCircle, label: 'Completed',    value: completedCount, color: '#34d399', iconBg: isDark ? 'rgba(52,211,153,0.15)' : '#d1fae5' },
              { icon: Clock,       label: 'In Progress',  value: inProgCount,    color: '#38bdf8', iconBg: isDark ? 'rgba(56,189,248,0.15)' : '#e0f2fe' },
              { icon: TrendingUp,  label: 'Completion',   value: `${completionRate}%`, color: '#fbbf24', iconBg: isDark ? 'rgba(251,191,36,0.15)' : '#fef3c7' },
            ].map(({ icon: Icon, label, value, color, iconBg }) => (
              <div key={label} className="rounded-2xl p-4 flex flex-col gap-2"
                style={{ background: T.cardBg, border: `1px solid ${T.cardBord}` }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: iconBg }}>
                  <Icon size={15} style={{ color }} />
                </div>
                <p className="text-2xl font-extrabold m-0 leading-none" style={{ color }}>{value}</p>
                <p className="text-[11px] font-medium m-0" style={{ color: T.muted }}>{label}</p>
              </div>
            ))}
          </div>
          )}

          {isUser && (
          <div className="rounded-2xl p-5" style={{ background: T.cardBg, border: `1px solid ${T.cardBord}` }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold uppercase tracking-widest m-0" style={{ color: T.muted }}>Overall Progress</p>
              <span className="text-xs font-bold" style={{ color: '#a78bfa' }}>{completionRate}%</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden mb-3" style={{ background: T.barTrack }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${completionRate}%`, background: 'linear-gradient(90deg, #8b5cf6, #6366f1)' }} />
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: T.muted }}>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-500" />{completedCount} completed</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: '#38bdf8' }}/>{inProgCount} in progress</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: T.barTrack }}/>{todoCount} todo</div>
            </div>
          </div>
          )} 

          {isUser && (
          <div className="rounded-2xl overflow-hidden" style={{ background: T.cardBg, border: `1px solid ${T.cardBord}` }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${T.divider}` }}>
              <p className="text-[11px] font-bold uppercase tracking-widest m-0" style={{ color: T.muted }}>Recent Tasks</p>
              <span className="text-xs rounded-full px-3 py-1" style={{ color: T.muted, background: T.tagBg, border: `1px solid ${T.tagBord}` }}>
                {myTasks.length} total
              </span>
            </div>

            {recentTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-2">
                <ListTodo size={22} style={{ color: T.muted }} />
                <p className="text-sm font-semibold m-0" style={{ color: T.body }}>No tasks assigned yet</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {recentTasks.map((task, i) => {
                  const st = statusToken(task.status);
                  return (
                    <div key={task.id}
                      className="flex items-center gap-4 px-5 py-3.5 transition-colors duration-150"
                      style={{ borderTop: i === 0 ? 'none' : `1px solid ${T.divider}` }}
                      onMouseEnter={e => e.currentTarget.style.background = T.rowHov}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: pColor(task.priority) }} />
                      <p className="flex-1 text-sm font-semibold m-0 truncate" style={{ color: T.head }}>{task.title}</p>
                      <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide shrink-0"
                        style={{ color: st.c, background: st.bg, border: `1px solid ${st.b}` }}>
                        {task.status}
                      </span>
                      {task.due && (
                        <span className="text-[11px] shrink-0 hidden sm:block" style={{ color: T.muted }}>
                          {formatDate(task.due)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          )} 

          <div className="rounded-2xl p-5 grid grid-cols-2 gap-4" style={{ background: T.cardBg, border: `1px solid ${T.cardBord}` }}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-1 m-0" style={{ color: T.muted }}>Account ID</p>
              <p className="text-sm font-semibold m-0 truncate" style={{ color: T.body }}>#{user?.id || '—'}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-1 m-0" style={{ color: T.muted }}>Role</p>
              <p className="text-sm font-semibold capitalize m-0" style={{ color: roleColor }}>{user?.role || '—'}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-1 m-0" style={{ color: T.muted }}>Username</p>
              <p className="text-sm font-semibold m-0" style={{ color: T.body }}>{user?.username || '—'}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-1 m-0" style={{ color: T.muted }}>Member Since</p>
              <p className="text-sm font-semibold m-0" style={{ color: T.body }}>{user?.created_at ? formatDate(user.created_at) : '—'}</p>
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: T.cardBg, border: `1px solid ${T.cardBord}` }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Key size={14} style={{ color: '#a78bfa' }} />
                <p className="text-[11px] font-bold uppercase tracking-widest m-0" style={{ color: T.muted }}>Change Password</p>
              </div>
              {!editingPassword ? (
                <button onClick={() => setEditingPassword(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer border"
                  style={{ color: '#a78bfa', background: isDark ? 'rgba(139,92,246,0.10)' : '#ede9fe', borderColor: isDark ? 'rgba(139,92,246,0.25)' : '#c4b5fd' }}>
                  <Pencil size={11} /> Change
                </button>
              ) : (
                <button onClick={() => { setEditingPassword(false); setPwError(''); setPasswords({ current:'', newPass:'', confirm:'' }); }}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer border"
                  style={{ color: T.muted, background: T.tagBg, borderColor: T.tagBord }}>
                  <X size={11} /> Cancel
                </button>
              )}
            </div>

            {!editingPassword ? (
                <p className="text-xs m-0" style={{ color: T.muted }}>••••••••••••</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'current', placeholder: 'Current password' },
                    { key: 'newPass', placeholder: 'New password' },
                    { key: 'confirm', placeholder: 'Confirm new password' },
                  ].map(({ key, placeholder }) => (
                    <div key={key} className="relative">
                      <input
                        type={showPasswords[key] ? "text" : "password"}
                        placeholder={placeholder}
                        value={passwords[key]}
                        onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                        style={{ ...inputStyle, paddingRight: '40px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, [key]: !prev[key]}))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent p-0"
                        style={{ color: T.muted }}>
                        {showPasswords[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  ))}

                  {(pwError || pwSuccess) && (
                    <div className="sm:col-span-3">
                      {pwError && (<p className="text-xs m-0" style={{ color: '#f87171' }}>{pwError}</p>)}
                      {pwSuccess && (<p className="text-xs m-0" style={{ color: '#34d399' }}>{pwSuccess}</p>)}
                    </div>
                  )}
                  <button
                    onClick={handlePasswordSave}
                    className="sm:col-span-3 flex items-center justify-center gap-2 py-2 text-sm font-bold text-white rounded-xl cursor-pointer border-none"
                    style={{ background: '#7c3aed', boxShadow: '0 4px 14px rgba(124,58,237,0.30)' }}
                  >
                    <Save size={13} /> Save Password
                  </button>
                </div>
              )}
          </div>

        </div>
      </div>
    </div>
  );
}