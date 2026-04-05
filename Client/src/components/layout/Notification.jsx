import { Bell, X } from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function TopNotification({ message, onClose }) {
  const [showNotification, setShowNotification] = useState(true);
  const { T, isDark } = useContext(ThemeContext);

  useEffect(() => {
    setShowNotification(true);
    const timer = setTimeout(() => {
      setShowNotification(false);
      onClose?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!showNotification) return null;

  return (
    <div
      className="fixed top-13 right-4 z-50 flex items-center justify-between gap-3 px-4 py-4 rounded-xl shadow-lg border w-[90%] max-w-sm"
      style={{background: isDark ? '#1e1f2a' : '#ffffff', color: T.head, borderColor: T.cardBord}}
    >
      <div className="flex items-center gap-2">
        <Bell size={16} style={{ color: "#a78bfa" }} />
        <p className="text-sm font-medium m-0" style={{ color: T.head }}>{message}</p>
      </div>
      <button
        onClick={() => { setShowNotification(false); onClose?.(); }}
        className="border-none bg-transparent cursor-pointer p-1"
        style={{ color: T.muted }}
        >
        <X size={16} />
      </button>
    </div>
  );
}