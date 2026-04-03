import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext.jsx";

export default function Navbar() {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <nav
      className="h-14 flex items-center justify-between px-6 relative z-40 transition-colors duration-300"
      style={{
        background: "var(--navbar-bg)",
        borderBottom: "1px solid var(--border-base)",
        backdropFilter: "blur(12px)",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <span
          className="font-bold text-sm tracking-wide transition-colors duration-300"
          style={{ color: "var(--text-primary)" }}
        >
          Task<span style={{ color: "#a78bfa" }}>MS</span>
        </span>
      </div>

      <button
        onClick={toggleTheme}
        className="relative flex items-center w-14 h-7 rounded-full p-0.5 transition-all duration-300 focus:outline-none"
        style={{
          background: isDark ? "rgba(139,92,246,0.20)" : "rgba(251,191,36,0.18)",
          border: isDark
            ? "1px solid rgba(139,92,246,0.40)"
            : "1px solid rgba(251,191,36,0.50)",
        }}
        title={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
      >
        <span className="absolute left-1 text-[11px] leading-none select-none pointer-events-none">🌙</span>
        <span className="absolute right-1 text-[11px] leading-none select-none pointer-events-none">☀️</span>

        <span
          className="relative z-10 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: isDark
              ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
              : "linear-gradient(135deg, #f59e0b, #f97316)",
            transform: isDark ? "translateX(0px)" : "translateX(28px)",
            boxShadow: isDark
              ? "0 2px 8px rgba(124,58,237,0.6)"
              : "0 2px 8px rgba(245,158,11,0.6)",
          }}
        >
          {isDark ? (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="4" />
              <line x1="12" y1="2"    x2="12" y2="4"  />
              <line x1="12" y1="20"   x2="12" y2="22" />
              <line x1="4.93" y1="4.93"  x2="6.34" y2="6.34"   />
              <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
              <line x1="2"  y1="12" x2="4"  y2="12" />
              <line x1="20" y1="12" x2="22" y2="12" />
              <line x1="4.93"  y1="19.07" x2="6.34"  y2="17.66" />
              <line x1="17.66" y1="6.34"  x2="19.07" y2="4.93"  />
            </svg>
          )}
        </span>
      </button>
    </nav>
  );
}