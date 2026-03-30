import { colors } from "../data/data.js";

export function getInitials(username) {
  if (!username) return "?";
  const parts = username.trim().split(/[\s_-]+/);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function formatUsername(username) {
  if (!username) return "";

  return username.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export function getAvatarColor(username) {
  if (!username) return colors[0];
  const idx = username.charCodeAt(0) % colors.length;
  return colors[idx];
}
  