import { createContext, useContext, useState, useEffect } from "react";

export const ThemeContext = createContext({
  isDark: true,
  toggleTheme: () => {},
  T: {},
});

function buildTokens(isDark) {
  return {
    bg: isDark ? "#0a0b0f" : "#f0f2f5",
    cardBg: isDark ? "rgba(255,255,255,0.04)" : "#ffffff",
    cardBord: isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0",

    head: isDark ? "#f1f5f9" : "#0f172a",
    sub: isDark ? "#64748b" : "#94a3b8",
    body: isDark ? "#cbd5e1" : "#334155",
    muted: isDark ? "#475569" : "#94a3b8",

    inputBg: isDark ? "rgba(255,255,255,0.05)" : "#ffffff",
    inputBord: isDark ? "rgba(255,255,255,0.10)" : "#e2e8f0",

    tagBg: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
    tagBord: isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0",

    divider: isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0",
    thBg: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
    rowHov: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
    barTrack: isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0",
    listItem: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc",
    listBord: isDark ? "rgba(255,255,255,0.07)" : "#e2e8f0",

    sidebar: isDark ? "#0d0e14" : "#ffffff",
    sidebarBord: isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0",
    sidebarLabel: isDark ? "#334155" : "#94a3b8",
    inactive: isDark ? "#475569" : "#64748b",
    hoverBg: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
    hoverColor: isDark ? "#94a3b8" : "#1e293b",
    hoverBorder: isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0",
    profileCardBg: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc",
    profileBord: isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0",
    popupBg: isDark ? "#13141c" : "#ffffff",
    popupBorder: isDark ? "rgba(255,255,255,0.10)" : "#e2e8f0",
    popupShadow: isDark
      ? "0 -8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)"
      : "0 -8px 24px rgba(0,0,0,0.10)",
    nameColor: isDark ? "#f1f5f9" : "#0f172a",
    roleColor: isDark ? "#64748b" : "#94a3b8",
    menuColor: isDark ? "#94a3b8" : "#475569",
    menuHoverBg: isDark ? "rgba(255,255,255,0.07)" : "#f1f5f9",
    menuHoverColor: isDark ? "#f1f5f9" : "#0f172a",
  };
}

function applyTheme(isDark) {
  const root = document.documentElement;
  root.classList.toggle("dark", isDark);
  root.style.backgroundColor = isDark ? "#0a0b0f" : "#f0f2f5";
  document.body.style.backgroundColor = isDark ? "#0a0b0f" : "#f0f2f5";

  const vars = isDark
    ? {
        "--bg-base": "#0a0b0f",
        "--bg-surface": "rgba(255,255,255,0.04)",
        "--bg-surface-hover": "rgba(255,255,255,0.07)",
        "--border-base": "rgba(255,255,255,0.08)",
        "--border-accent": "rgba(255,255,255,0.12)",
        "--text-primary": "#f1f5f9",
        "--text-secondary": "#94a3b8",
        "--text-muted": "#475569",
        "--sidebar-bg": "#0d0e14",
        "--navbar-bg": "rgba(10,11,15,0.95)",
        "--card-bg": "rgba(255,255,255,0.03)",
        "--input-bg": "rgba(255,255,255,0.05)",
        "--page-bg": "#0a0b0f",
      }
    : {
        "--bg-base": "#f0f2f5",
        "--bg-surface": "#ffffff",
        "--bg-surface-hover": "#f8fafc",
        "--border-base": "#e2e8f0",
        "--border-accent": "#cbd5e1",
        "--text-primary": "#0f172a",
        "--text-secondary": "#475569",
        "--text-muted": "#94a3b8",
        "--sidebar-bg": "#ffffff",
        "--navbar-bg": "rgba(255,255,255,0.95)",
        "--card-bg": "#ffffff",
        "--input-bg": "#f8fafc",
        "--page-bg": "#f0f2f5",
      };

  Object.entries(vars).forEach(([key, val]) =>
    root.style.setProperty(key, val),
  );
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem("tsm-theme");
      return saved !== null ? saved === "dark" : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    applyTheme(isDark);
    try {
      localStorage.setItem("tsm-theme", isDark ? "dark" : "light");
    } catch {}
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const T = buildTokens(isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, T }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
