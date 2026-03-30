import { useState, useEffect } from "react";
import { Play, Square } from "lucide-react";

export default function Timer({ isRunning, startTime, onStart, onStop, endTime, T, isDark }) {

  const [seconds, setSeconds] = useState(0);
  const endTimeInSeconds = Math.floor(endTime / 1000);

  useEffect(() => {
    if (!isRunning) return;
      const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);

      setSeconds(elapsed);
      
      if (elapsed >= endTimeInSeconds) {
        clearInterval(interval);
        onStop(elapsed);
      }
    }, 1000);

    return () => clearInterval(interval);

  }, [isRunning, startTime, endTime, onStop, endTimeInSeconds]);

  const handleStop = () => {
    onStop(seconds);
  };

  return (

    <div className="flex flex-col gap-5">

      <div className="flex items-center justify-between">

        <span className="font-mono text-4xl font-semibold tabular-nums tracking-tight" style={{ color: T.head }}>
          {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
        </span>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={onStart}
          style={{ background: '#6366f1' }}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition active:scale-95"
        >
          <Play size={16} fill="white" />
          Start
        </button>

        <button
          onClick={handleStop}
          style={{ background: '#ef4444' }}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl shadow-sm transition active:scale-95"
        >
          <Square size={16} fill="white" />
          Stop
        </button>
      </div>
    </div>

  );

}