import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useState, useContext } from "react";
import axios from "axios";
import { titles, priority, status, categories, estimated_hours } from "../../data/data.js";
import { TasksContext } from "../../context/TasksContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { ThemeContext } from "../../context/ThemeContext.jsx";

const BASE_URL = "http://localhost:8080";
const today = new Date().toISOString().split("T")[0];

export default function TaskModal({ isOpen, onClose, onTaskAdded, task }) {
  const { users } = useContext(TasksContext);
  const { user } = useContext(AuthContext);
  const { isDark, T } = useContext(ThemeContext);

  const allUsers = users.filter(u => u.role.toLowerCase() === 'user');
  const isEditing = !!task;

  const [form, setForm] = useState(
    task ? {
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "",
      created_at: task.created_at?.split("T")[0] || today,
      due: task.due?.split("T")[0] || "",
      status: task.status || "todo",
      assignee: task.assignee || "",
      category: task.category || "",
      estimated_hours: task.estimated_hours || "",
      created_by: task.created_by || user?.username || ""
    } : {
      title: "",
      description: "",
      priority: "",
      created_at: today,
      due: "",
      status: "todo",
      assignee: "",
      category: "",
      estimated_hours: "",
      created_by: user?.username || ""
    }
  );

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
  if (!form.title || !form.priority || !form.due || !form.assignee) {
    setError("Please fill in title, priority, due date and assignee.");
    return;
  }
  try {
    if (isEditing) {
      const { created_at, ...updateData } = form;
      await axios.put(`${BASE_URL}/api/tasks/${task.id}`, updateData, { withCredentials: true });
    } else {
      await axios.post(`${BASE_URL}/api/tasks/add`, form, { withCredentials: true });
    }
    setForm({
      title: "", 
      description: "",
       priority: "",
      created_at: today,
      due: "",
      status: "todo",
      assignee: "",
      category: "",
      estimated_hours: "",
      created_by: user?.username || ""
    });
    setError("");
    onTaskAdded();
    onClose();
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || "Something went wrong. Please try again.");
  }
};

  const inputStyle = {
    marginTop: 4,
    width: '100%',
    padding: '8px 12px',
    borderRadius: 10,
    fontSize: 13,
    background: isDark ? "#111827" : "#ffffff",
    border: `1px solid ${T.inputBord}`,
    color: isDark ? "#f9fafb" : "#111827",
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    colorScheme: isDark ? 'dark' : 'light',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };

  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: T.muted,
  };

  const onFocus = e => {
    e.target.style.borderColor = isDark ? 'rgba(99,102,241,0.5)' : '#a5b4fc';
    e.target.style.boxShadow = `0 0 0 3px ${isDark ? 'rgba(99,102,241,0.10)' : 'rgba(99,102,241,0.07)'}`;
  };

  const onBlur = e => {
    e.target.style.borderColor = T.inputBord;
    e.target.style.boxShadow = 'none';
  };

  return (
    <>
      {isOpen && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
        >
          <div
            className="w-full mx-4 relative max-h-[90vh] overflow-y-auto"
            style={{
              maxWidth: 520,
              background: T.cardBg,
              border: `1px solid ${T.cardBord}`,
              borderRadius: 20,
              boxShadow: isDark ? '0 24px 60px rgba(0,0,0,0.6)' : '0 16px 48px rgba(0,0,0,0.12)',
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            <div style={{ padding: '24px 24px 20px' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p style={{ ...labelStyle, color: '#6366f1', marginBottom: 4 }}>
                    {isEditing ? 'Edit Task' : 'New Task'}
                  </p>
                  <h2 className="text-lg font-extrabold m-0 tracking-tight" style={{ color: T.head }}>
                    {isEditing ? 'Edit Task' : 'Assign Task'}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-8 h-8 cursor-pointer border-none transition-all duration-150"
                  style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', color: T.muted, borderRadius: 10 }}
                  onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.10)' : '#e2e8f0'; e.currentTarget.style.color = T.head; }}
                  onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'; e.currentTarget.style.color = T.muted; }}
                >
                  <X size={15} />
                </button>
              </div>

              {error && (
                <div className="mb-4 px-4 py-3 text-sm font-medium"
                  style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', borderRadius: 10 }}>
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div>
                  <label style={labelStyle}>Title <span style={{ color: '#f87171' }}>*</span></label>
                  <select name="title" value={form.title} onChange={handleChange}
                    style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                    <option value="">Select Title</option>
                    {titles.map(t => <option key={t.id} value={t.title}>{t.title}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    name="description" value={form.description} onChange={handleChange}
                    rows={3} placeholder="Describe what needs to be done..."
                    style={{ ...inputStyle, resize: 'none' }}
                    onFocus={onFocus} onBlur={onBlur}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={labelStyle}>Priority <span style={{ color: '#f87171' }}>*</span></label>
                    <select name="priority" value={form.priority} onChange={handleChange}
                      style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                      <option value="">Select Priority</option>
                      {priority.map(p => <option key={p.id} value={p.priority}>{p.priority}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Status</label>
                    <select name="status" value={form.status} onChange={handleChange}
                      style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                      {status.map(s => <option key={s.id} value={s.status}>{s.status}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {isEditing && (
                    <div>
                      <label style={labelStyle}>Created At</label>
                      <input type="date" name="created_at" value={form.created_at} readOnly
                        style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />
                    </div>
                  )}
                  <div className={isEditing ? '' : 'col-span-2'}>
                    <label style={labelStyle}>Due Date <span style={{ color: '#f87171' }}>*</span></label>
                    <input type="date" name="due" value={form.due} onChange={handleChange}
                      style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Assignee <span style={{ color: '#f87171' }}>*</span></label>
                  <select name="assignee" value={form.assignee} onChange={handleChange}
                    style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                    <option value="">Select Assignee</option>
                    {allUsers.map(u => <option key={u.id} value={u.username}>{u.username}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Created By</label>
                  <input type="text" name="created_by" value={form.created_by} readOnly
                    style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={labelStyle}>Category</label>
                    <select name="category" value={form.category} onChange={handleChange}
                      style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.category}>{c.category}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Estimated Hours</label>
                    <select name="estimated_hours" value={form.estimated_hours} onChange={handleChange}
                      style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                      <option value="">Select Hours</option>
                      {estimated_hours.map(h => <option key={h.id} value={h.hours}>{h.label}</option>)}
                    </select>
                  </div>
                </div>

              </div>

              <div className="flex flex-col gap-2 mt-6">
                <button
                  onClick={handleSubmit}
                  className="w-full py-2.5 text-sm font-bold text-white cursor-pointer border-none transition-all duration-150"
                  style={{ background: '#6366f1', borderRadius: 10, boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
                  onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}
                >
                  {isEditing ? 'Update Task' : 'Assign Task'}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 text-sm font-semibold cursor-pointer border-none transition-all duration-150"
                  style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', color: T.muted, borderRadius: 10 }}
                  onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}
                  onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}