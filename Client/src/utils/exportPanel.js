const pad = (n) => String(n).padStart(2, '0');

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(m)}:${pad(s)}`;             
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const toMilliseconds = (timeString) => {
  const value = parseInt(timeString.split(" ")[0]);
  const unit = timeString.split(" ")[1].toLowerCase();

  if (unit.includes("hour") || unit.includes("hr")) {
    return value * 60 * 60 * 1000;
  } else if (unit.includes("min")) {
    return value * 60 * 1000;
  } else if (unit.includes("sec")) {
    return value * 1000;
  } else {
    return null;
  }
};

const toTimeString = (milliseconds) => {
  const seconds = milliseconds / 1000;
  const minutes = milliseconds / (1000 * 60);
  const hours = milliseconds / (1000 * 60 * 60);

  if (seconds < 60) {
    return `${Math.floor(seconds)} sec`;
  } else if (minutes < 60) {
    return `${Math.floor(minutes)} min`;
  } else {
    return `${Math.floor(hours)} hr${Math.floor(hours) > 1 ? "s" : ""}`;
  }
};

export {formatDuration, formatDate, formatTime, pad, toMilliseconds, toTimeString}