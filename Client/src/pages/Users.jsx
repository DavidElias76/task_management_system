import { Pencil, Trash2, Search, SlidersHorizontal } from "lucide-react";
import { TasksContext } from "../context/TasksContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { useState, useContext } from "react";
import AddUserModal from "../components/Modals/AddUserModal.jsx";
import formatDate from "../utils/formatDate.js";
import useDebounce from "../hooks/UsersDebounce.js";
import axios from "axios";
import TopNotification from "../components/layout/Notification.jsx";

const avatarPalette = [
  "#7c3aed", "#0284c7", "#059669","#d97706","#db2777","#4f46e5"
];
const getAvatarColor = (u) => avatarPalette[u.charCodeAt(0) % avatarPalette.length];

export default function Users() {
  const { users, error, refetchUsers } = useContext(TasksContext);
  const { isDark, T } = useContext(ThemeContext);

  const [isUserOpen, setIsUserOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [edituser, setEditUser] = useState(null);
  const [notification, setNotification] = useState(false)

  const debouncedSearch = useDebounce(search, 300);

  const filteredUsers = users.filter((u) => {
    const t = debouncedSearch.toLowerCase();
    return (
      u.username.toLowerCase().includes(t) ||
      u.email.toLowerCase().includes(t) ||
      u.role.toLowerCase().includes(t)
    );
  });

  const handleEditUser = (u) => {
    setEditUser(u);
    setIsUserOpen(true);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/users/${id}`);
      refetchUsers();
      setNotification('User deleted successfully')
    } catch (e) {
      console.error(e);
    }
  };

  const roleStyle = (role) => {
    if (role === "Admin")
      return isDark ? 
        { c: "#a78bfa", bg: "rgba(139,92,246,0.10)", b: "rgba(139,92,246,0.25)"} : 
        { c: "#7c3aed", bg: "#ede9fe", b: "#c4b5fd" };

    if (role === "Manager")
      return isDark ? 
        {c: "#fbbf24", bg: "rgba(251,191,36,0.10)", b: "rgba(251,191,36,0.25)"} : 
        { c: "#d97706", bg: "#fef3c7", b: "#fcd34d" };
        
      return isDark ? 
        { c: "#34d399", bg: "rgba(52,211,153,0.10)", b: "rgba(52,211,153,0.25)"} : 
        { c: "#059669", bg: "#d1fae5", b: "#6ee7b7" };
  };

  return (
    <div
      className="min-h-screen p-6 lg:p-8"
      style={{ background: T.bg, fontFamily: "'DM Sans',system-ui,sans-serif" }}
    >
      {error && (
        <div
          className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
          style={{
            border: "1px solid rgba(248,113,113,0.3)",
            background: "rgba(248,113,113,0.08)",
            color: "#f87171",
          }}
        >
          {error}
        </div>
      )}

      {notification && ( <TopNotification message={notification} onClose={() => setNotification("")}/>)}     
      

      <div className="flex items-center justify-between mb-7">
        <div>
          <p
            className="text-[11px] font-bold uppercase tracking-[0.22em] mb-1.5"
            style={{ color: "#fbbf24" }}
          >
            Workspace
          </p>
          <h1
            className="text-3xl font-extrabold tracking-tight m-0"
            style={{ color: T.head }}
          >
            Users
          </h1>
          <p className="text-sm mt-1" style={{ color: T.sub }}>
            Manage your system users
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span
            className="text-xs rounded-full px-3.5 py-1.5"
            style={{
              color: T.muted,
              background: T.tagBg,
              border: `1px solid ${T.tagBord}`,
            }}
          >
          {filteredUsers.length} users
          </span>
          <button
            onClick={() => setIsUserOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-black rounded-xl cursor-pointer border-none"
            style={{
              background: "#d97706",
              boxShadow: "0 4px 14px rgba(217,119,6,0.30)",
            }}
          >
            + Add User
          </button>

          <AddUserModal
            key={edituser ? edituser.id : "New"}
            isUserOpen={isUserOpen}
            setIsUserOpen={() => {
              setIsUserOpen(false);
              setEditUser(null);
            }}
            onUserAdded={() => {
              refetchUsers();
              setNotification('User added successfully!');
            }}
            onUserEdited={() => {
              refetchUsers();
              setNotification('User updated successfully!');
            }}
            user={edituser}
          />

        </div>
      </div>

      <div className="mb-6 flex items-center gap-2.5">
        <div className="relative flex-1 max-w-md">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: T.muted }}
          />
          <input
            type="text"
            placeholder="Search by username, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl text-sm outline-none"
            style={{
              background: T.inputBg,
              border: `1px solid ${T.inputBord}`,
              color: T.head,
            }}
          />
        </div>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: T.cardBg, border: `1px solid ${T.cardBord}` }}
      >
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr
              style={{
                background: T.thBg,
                borderBottom: `1px solid ${T.divider}`,
              }}
            >
              {["User", "Email", "Role", "Created", "Actions"].map((h) => (
                <th
                  key={h}
                  className={`px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${h === "Actions" ? "text-center" : "text-left"}`}
                  style={{ color: T.muted }}
                >{h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const rs = roleStyle(user.role);
              const av = getAvatarColor(user.username);
              return (
                <tr
                  key={user.id}
                  className="transition-colors duration-150"
                  style={{ borderTop: `1px solid ${T.divider}` }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = T.rowHov)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{
                          background: `${av}22`,
                          color: av,
                          border: `1px solid ${av}44`,
                        }}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold" style={{ color: T.head }}>
                        {user.username}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-5 py-3.5 text-xs"
                    style={{ color: T.muted }}
                    >
                    {user.email}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider"
                      style={{
                        color: rs.c,
                        background: rs.bg,
                        border: `1px solid ${rs.b}`,
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td
                    className="px-5 py-3.5 text-xs"
                    style={{ color: T.muted }}
                  >
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer border"
                        style={{
                          color: "#a78bfa",
                          background: isDark
                            ? "rgba(139,92,246,0.10)"
                            : "#ede9fe",
                          borderColor: isDark
                            ? "rgba(139,92,246,0.25)"
                            : "#c4b5fd",
                        }}
                      >
                        <Pencil size={11} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer border"
                        style={{
                          color: "#f87171",
                          background: isDark
                            ? "rgba(248,113,113,0.08)"
                            : "#fff1f2",
                          borderColor: isDark
                            ? "rgba(248,113,113,0.20)"
                            : "#fecaca",
                        }}
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <Search size={22} style={{ color: T.muted }} />
            <p className="text-sm font-semibold m-0" style={{ color: T.head }}>
              No users found
            </p>
            <p className="text-xs m-0" style={{ color: T.muted }}>
              Try adjusting your search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
