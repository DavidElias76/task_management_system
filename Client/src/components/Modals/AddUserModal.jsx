import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { userRoles } from "../../data/data.js";
import { useState, useContext } from "react";
import axios from 'axios';
import { ThemeContext } from "../../context/ThemeContext.jsx";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:8080";

export default function AddUserModal({ isUserOpen, setIsUserOpen, onUserAdded, user }) {
  const { isDark, T } = useContext(ThemeContext);
  const isEditingUser = !!user;

  const [userData, setUserData] = useState(
    isEditingUser
      ? {
          username: user.username || "",
          email: user.email || "",
          password: user.password || "",
          role:  user.role || "",
          created_at: user.created_at?.split("T")[0] || "",
        }
      : { username: "", email: "", password: "", role: "", created_at: "" }
  );
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!userData.username || !userData.email || !userData.password || !userData.role || !userData.created_at) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      if (isEditingUser) {
        await axios.put(`${BASE_URL}/api/users/${user.id}`, userData);
      } else {
        await axios.post(`${BASE_URL}/api/users/add`, userData);
        toast.success("user added successfully!");
      }
      setUserData({ username: "", email: "", password: "", role: "", created_at: "" });
      setError("");
      onUserAdded();
      setIsUserOpen(false);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      toast.error(err.message || "Error adding the user")
    }
  };

  const inputStyle = {
    marginTop: 4,
    width: '100%',
    padding: '8px 12px',
    borderRadius: 10,
    fontSize: 13,
    background: T.inputBg,
    border: `1px solid ${T.inputBord}`,
    color: T.head,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    colorScheme: isDark ? 'dark' : 'light',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };
  const onFocus = e => {
    e.target.style.borderColor = isDark ? 'rgba(99,102,241,0.5)' : '#a5b4fc';
    e.target.style.boxShadow   = `0 0 0 3px ${isDark ? 'rgba(99,102,241,0.10)' : 'rgba(99,102,241,0.07)'}`;
  };
  const onBlur = e => {
    e.target.style.borderColor = T.inputBord;
    e.target.style.boxShadow   = 'none';
  };
  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: T.muted,
  };

  return (
    <>
      {isUserOpen && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
        >
          <div
            className="w-full mx-4 relative"
            style={{
              maxWidth: 480,
              background: T.cardBg,
              border: `1px solid ${T.cardBord}`,
              borderRadius: 20,
              boxShadow: isDark ? '0 24px 60px rgba(0,0,0,0.6)' : '0 16px 48px rgba(0,0,0,0.12)',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              overflow: 'hidden',
            }}
          >
            <div style={{ height: 3, background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4)' }} />
            <div style={{ padding: '24px 24px 20px' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p style={{ ...labelStyle, color: '#6366f1', marginBottom: 4 }}>
                    {isEditingUser ? 'Edit Account' : 'New Account'}
                  </p>
                  <h2 className="text-lg font-extrabold m-0 tracking-tight" style={{ color: T.head }}>
                    {isEditingUser ? 'Edit User' : 'Add New User'}
                  </h2>
                </div>
                <button
                  onClick={() => setIsUserOpen(false)}
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
                  <label style={labelStyle}>Username <span style={{ color: '#f87171' }}>*</span></label>
                  <input type="text" name="username" placeholder="Enter username"
                    onChange={handleChange} value={userData.username}
                    style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>

                <div>
                  <label style={labelStyle}>Email <span style={{ color: '#f87171' }}>*</span></label>
                  <input type="email" name="email" placeholder="Enter email address"
                    onChange={handleChange} value={userData.email}
                    style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>

                <div>
                  <label style={labelStyle}>Password <span style={{ color: '#f87171' }}>*</span></label>
                  <input type="password" name="password" placeholder="••••••••"
                    onChange={handleChange} value={userData.password}
                    style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={labelStyle}>Role <span style={{ color: '#f87171' }}>*</span></label>
                    <select
                      name="role"
                      onChange={handleChange}
                      value={userData.role}
                      style={{...inputStyle, cursor: "pointer", backgroundColor: T.inputBg, color: T.head, border: `1px solid ${T.inputBord}`, colorScheme: isDark ? "dark" : "light", appearance: "none",
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                        outline: 'none'
                      }}
                      onFocus={onFocus}
                      onBlur={onBlur}>
                      <option value=""
                        style={{backgroundColor: isDark ? "#111827" : "#ffffff", color: isDark ? "#f9fafb" : "#111827"}}>
                        Select Role
                      </option>
                      {userRoles.map((role) => (
                        <option key={role.id} value={role.role}
                          style={{ backgroundColor: isDark ? "#111827" : "#ffffff", color: isDark ? "#f9fafb" : "#111827", outline: 'none'}}>
                          {role.role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Date Created</label>
                    <input type="date" name="created_at"
                      onChange={handleChange} value={userData.created_at}
                      style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
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
                  {isEditingUser ? 'Save Changes' : 'Add User'}
                </button>
                <button
                  onClick={() => setIsUserOpen(false)}
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