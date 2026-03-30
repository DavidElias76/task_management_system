import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import { colors } from "../../data/data.js";
import { getInitials } from "../../utils/ExportInitials.js";
import {
  LayoutDashboard,
  UsersRound,
  CheckSquare,
  Clock,
  CheckCircle,
  BarChart3,
  LogOut,
  User,
  ChevronUp,
  UserCircle,
} from "lucide-react";

const ROLE_PERMISSIONS = {
  admin: ["dashboard", "reports", "users"],
  manager: ["dashboard", "tasks", "in-progress", "completed", "reports"],
  user: ["dashboard", "tasks", "in-progress", "completed"],
};

const navItems = [
  { to: "/dashboard", routeKey: "dashboard", icon: LayoutDashboard, label: "Dashboard"},
  { to: "/tasks", routeKey: "tasks", icon: CheckSquare, label: "Tasks"},
  { to: "/users", routeKey: "users", icon: UsersRound, label: "Users"},
  { to: "/in-progress", routeKey: "in-progress", icon: Clock, label: "In Progress"},
  { to: "/completed", routeKey: "completed", icon: CheckCircle, label: "Completed"},
  { to: "/reports", routeKey: "reports", icon: BarChart3, label: "Reports"},
  { to: "/profile", routeKey: null, icon: UserCircle, label: "Profile"},
];

const accentsDark = {
  dashboard: {
    color: "#a78bfa",
    bg: "rgba(139,92,246,0.12)",
    border: "rgba(139,92,246,0.30)",
  },
  tasks: {
    color: "#818cf8",
    bg: "rgba(99,102,241,0.12)",
    border: "rgba(99,102,241,0.30)",
  },
  users: {
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.12)",
    border: "rgba(251,191,36,0.30)",
  },
  "in-progress": {
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.12)",
    border: "rgba(56,189,248,0.30)",
  },
  completed: {
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
    border: "rgba(52,211,153,0.30)",
  },
  reports: {
    color: "#f472b6",
    bg: "rgba(244,114,182,0.12)",
    border: "rgba(244,114,182,0.30)",
  },
  profile: {
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.10)",
    border: "rgba(148,163,184,0.25)",
  },
};

const accentsLight = {
  dashboard: { color: "#7c3aed", bg: "#ede9fe", border: "#c4b5fd" },
  tasks: { color: "#4f46e5", bg: "#e0e7ff", border: "#a5b4fc" },
  users: { color: "#d97706", bg: "#fef3c7", border: "#fcd34d" },
  "in-progress": { color: "#0284c7", bg: "#e0f2fe", border: "#7dd3fc" },
  completed: { color: "#059669", bg: "#d1fae5", border: "#6ee7b7" },
  reports: { color: "#db2777", bg: "#fce7f3", border: "#f9a8d4" },
  profile: { color: "#64748b", bg: "#f1f5f9", border: "#cbd5e1" },
};

function getAvatarColor(username) {
  if (!username) return [colors[0], colors[0]];
  const c = colors[username.charCodeAt(0) % colors.length];
  return Array.isArray(c) ? c : [c, c];
}

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { isDark, T } = useContext(ThemeContext);

  const [profileOpen, setProfileOpen] = useState(false);
  const [message, setMessage] = useState("");
  const profileRef = useRef(null);

  const allowed = ROLE_PERMISSIONS[user?.role?.toLowerCase()] ?? [];
  const visibleItems = navItems.filter(
    (i) => i.routeKey === null || allowed.includes(i.routeKey),
  );
  const initials = getInitials(user?.username);
  const [c1, c2] = getAvatarColor(user?.username);
  const accents = isDark ? accentsDark : accentsLight;

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    try {
      await logout();
      setMessage("Logged out successfully");
      setTimeout(() => {
        setMessage("");
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Logout failed");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleGoToProfile = () => {
    setProfileOpen(false);   
    navigate("/profile");   
  };

  return (
    <>
      <aside
        style={{
          width: "224px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: T.sidebar,
          borderRight: `1px solid ${T.sidebarBord}`,
          fontFamily: "'DM Sans', system-ui, sans-serif",
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "22px 16px 8px" }}>
          <p
            style={{fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: T.sidebarLabel, margin: 0,
            }}
          > Navigation
          </p>
        </div>

        <nav
          style={{
            flex: 1,
            padding: "0 8px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            overflowY: "auto",
          }}
        >
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.to;
            const key = item.routeKey ?? "profile";
            const accent = accents[key] ?? accents.profile;
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 12px",
                  borderRadius: "11px",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 500,
                  position: "relative",
                  transition: "all 0.15s",
                  background: isActive ? accent.bg : "transparent",
                  color: isActive ? accent.color : T.inactive,
                  border: isActive
                    ? `1px solid ${accent.border}`
                    : "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = T.hoverBg;
                    e.currentTarget.style.color = T.hoverColor;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = T.inactive;
                  }
                }}
              >
                {isActive && (
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "3px",
                      height: "18px",
                      borderRadius: "99px",
                      background: accent.color,
                    }}
                  />
                )}
                <Icon
                  size={16}
                  style={{
                    color: isActive ? accent.color : "inherit",
                    flexShrink: 0,
                  }}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div
          style={{ margin: "4px 12px", borderTop: `1px solid ${T.divider}` }}
        />

        <div
          style={{ padding: "8px 10px 12px", position: "relative" }}
          ref={profileRef}
        >
          {profileOpen && (
            <div
              style={{
                position: "absolute",
                bottom: "100%",
                left: 0,
                right: 0,
                marginBottom: "6px",
                background: T.popupBg,
                border: `1px solid ${T.popupBorder}`,
                borderRadius: "14px",
                boxShadow: T.popupShadow,
                overflow: "hidden",
                zIndex: 100,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 14px",
                  borderBottom: `1px solid ${T.divider}`,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "9px",
                    flexShrink: 0,
                    background: `linear-gradient(135deg, ${c1}, ${c2})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {initials}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      fontWeight: 700,
                      color: T.nameColor,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user?.username || "Admin"}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "10px",
                      color: T.roleColor,
                      textTransform: "capitalize",
                    }}
                  >
                    {user?.role || "user"}
                  </p>
                </div>
              </div>

              <div style={{ padding: "6px" }}>
                <button
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "9px",
                    padding: "8px 12px",
                    borderRadius: "9px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: T.menuColor,
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = T.menuHoverBg;
                    e.currentTarget.style.color = T.menuHoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = T.menuColor;
                  }}
                  onClick={handleGoToProfile}
                >
                  <User size={13} /> Profile
                </button>

                <div
                  style={{
                    margin: "3px 0",
                    borderTop: `1px solid ${T.divider}`,
                  }}
                />

                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "9px",
                    padding: "8px 12px",
                    borderRadius: "9px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#f87171",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(248,113,113,0.10)";
                    e.currentTarget.style.color = "#fca5a5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#f87171";
                  }}
                >
                  <LogOut size={13} /> Logout
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setProfileOpen((p) => !p)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 10px",
              borderRadius: "11px",
              cursor: "pointer",
              background: T.profileCardBg,
              border: `1px solid ${T.profileBord}`,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = T.hoverBg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = T.profileCardBg;
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "8px",
                flexShrink: 0,
                background: `linear-gradient(135deg, ${c1}, ${c2})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  fontWeight: 600,
                  color: T.nameColor,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.username || "Admin"}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "10px",
                  color: T.roleColor,
                  textTransform: "capitalize",
                }}
              >
                {user?.role || "user"}
              </p>
            </div>
            <ChevronUp
              size={13}
              style={{
                color: T.roleColor,
                flexShrink: 0,
                transform: profileOpen ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.2s",
              }}
            />
          </button>
        </div>
      </aside>

      {message && (
        <div
          style={{
            position: "fixed",
            top: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            padding: "10px 20px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#4ade80",
            background: isDark ? "#13141c" : "#ffffff",
            border: "1px solid rgba(74,222,128,0.3)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          }}
        >
          {message}
        </div>
      )}
    </>
  );
}
