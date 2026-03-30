import { useState, useEffect, useCallback, useContext  } from 'react';
import {
  ArrowLeft, Clock, CheckCircle, AlertCircle,
  MessageSquare, Paperclip, Tag, Calendar, User, Play
} from 'lucide-react';
import StatusChanger from '../Panels/StatusChanger.jsx'
import axios from 'axios';
import { PRIORITY_STYLES } from '../../data/panel.js';
import { formatDate, toMilliseconds, toTimeString } from '../../utils/exportPanel.js';
import Section from '../Panels/Section.jsx';
import Timer from '../Panels/Timer.jsx';
import TimeLogs from '../Panels/TimeLogs.jsx';
import Comments from '../Panels/Comments.jsx';
import DelayReason from '../Panels/DelayReason.jsx';
import Attachments from '../Panels/Attachments.jsx';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import TopNotification from '../layout/Notification.jsx';

const BASE_URL = 'http://localhost:8080';

export default function TasksPanel({ task, currentUser, onBack, onTaskUpdated }) {
  const [status, setStatus] = useState(task.status ?? 'todo');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [pendingTimeLog, setPendingTimeLog] = useState(null);
  const [timeLogs, setTimeLogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [delayReason, setDelayReason] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState("");
  const [isDelayed, setIsDelayed] = useState(false);
  const [uploading, setUploading] = useState(false);


  const { isDark, T } = useContext(ThemeContext);
  const priority = PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.medium;

  const notify = useCallback((msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleStatusChange = useCallback(async (newStatus) => {
    const oldStatus = status;
    setStatus(newStatus);
    setStatusUpdating(true);
    try {
      await axios.put(`${BASE_URL}/api/tasks/${task.id}/status`,
        { status: newStatus, changed_by: currentUser.username },
        { withCredentials: true });
      onTaskUpdated?.({ ...task, status: newStatus });
      notify(`Status updated to ${newStatus}`);
    } catch {
      setStatus(oldStatus);
      notify('Failed to update status', 'error');
    } finally {
      setStatusUpdating(false);
    }
  }, [status, task, currentUser.username, onTaskUpdated, notify]);

  const handleStartTimer = useCallback((taskId) => {
    const startTime = Date.now();
    setPendingTimeLog({ task_id: taskId, started_at: startTime });
    if (status === 'todo') handleStatusChange('in-progress');
    setTimerRunning(true);
  }, [status, handleStatusChange]);

  const handleStopTimer = useCallback((taskId, seconds) => {
    const endTime = Date.now();
    const startTime = pendingTimeLog.started_at;
    const durationMs = endTime - startTime;
    const durationMinutes = toTimeString(durationMs);
    const endTimeInSeconds = Math.floor(toMilliseconds(task.estimated_hours) / 1000);
    if (seconds >= endTimeInSeconds) setIsDelayed(true);
    const log = {
      task_id: taskId,
      username: currentUser.username,
      started_at: startTime,
      ended_at: endTime,
      duration_minutes: durationMinutes,
      note: "done",
      created_at: formatDate(new Date())
    };
    setTimeLogs((prev) => [...prev, log]);
    setPendingTimeLog(null);
    setTimerRunning(false);
    notify(`Logged ${durationMinutes} - save with Submit`);
  }, [pendingTimeLog, notify, task.estimated_hours, currentUser]);

  const handleStart = useCallback(() => { handleStartTimer(task.id); }, [task.id, handleStartTimer]);
  const handleStop  = useCallback((seconds) => { handleStopTimer(task.id, seconds); }, [task.id, handleStopTimer]);

  const handleAddComment = useCallback((body) => {
    if (!body.trim()) return;
    setComments((prev) => [...prev, {
      body,
      username: currentUser?.username ?? 'You',
      created_at: new Date().toISOString(),
    }]);
  }, [currentUser]);

  const handleAddDelayReason = (reason) => {
    if (!reason.trim()) return;
    setDelayReason(reason);
  };

  const handleStageFile = (file) => {
    setUploading(true);
    console.log("staging file:", file);
    setAttachments((prev) => [...prev, {
      task_id: task.id,
      uploaded_by: currentUser.username,
      file_name: file.file_name,
      file_size: file.file_size,
      mime_type: file.mime_type,
      file: file.file,
      pending: true
    }]);
  };

  const handleCancelFile = (id) => {
    setAttachments((prev) => prev.filter(a => a.id !== id));
  };

  const handleCancel = () => {
    setTimeLogs([]);
    setComments([]);
    setAttachments([]);
    setPendingTimeLog(null);
    setTimerRunning(false);
    onBack();
  };

  const handleSubmitAll = async () => {
    setSubmitting(true);
    try {
      if (timeLogs.length > 0) {
        await axios.post(`${BASE_URL}/api/tasks/${task.id}/timelogs`, { logs: timeLogs }, { withCredentials: true });
      }
      if (isDelayed && delayReason) {
        await axios.post(`${BASE_URL}/api/tasks/${task.id}/delay`, { reason: delayReason, username: currentUser.username }, { withCredentials: true });
      } else if (comments.length > 0) {
        await axios.post(`${BASE_URL}/api/tasks/${task.id}/comments`, { comments }, { withCredentials: true });
      }
      if (attachments.length > 0) {
        const formData = new FormData();
        formData.append('uploaded_by', currentUser.username);
        attachments.filter(a => a.file).forEach(a => { formData.append('files', a.file); });
        await axios.post(`${BASE_URL}/api/tasks/${task.id}/attachments`, formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      await handleStatusChange('completed');
      onTaskUpdated?.({ ...task, status: 'completed', _notify: 'Task submitted successfully!' });
      notify('Task submitted successfully!');
      setTimeout(() => onBack(), 3000);
    } catch (err) {
      console.error(err);
      notify('Submission failed — please retry', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const hasPendingChanges = timeLogs.length > 0 || comments.length > 0 || attachments.length > 0;
  const priorityAccent = task.priority === 'high' ? '#f43f5e' : task.priority === 'medium' ? '#fbbf24' : '#10b981';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: T.bg, fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {notification && (
        <TopNotification
          message={notification.msg}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}        
      <div
        className="flex items-center justify-between gap-4 px-6 py-4"
        style={{ background: T.cardBg, borderBottom: `1px solid ${T.divider}` }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={handleCancel}
            className="flex items-center gap-1.5 text-sm font-medium transition-colors shrink-0"
            style={{ color: T.muted }}
            onMouseEnter={e => e.currentTarget.style.color = T.head}
            onMouseLeave={e => e.currentTarget.style.color = T.muted}
          >
            <ArrowLeft size={15} /> Back
          </button>

          <span style={{ width: 1, height: 16, background: T.divider }} />
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shrink-0"
            style={{
              color: task.priority === 'high' ? '#f87171' : task.priority === 'medium' ? '#fbbf24' : '#34d399',
              background:  task.priority === 'high' ? (isDark?'rgba(248,113,113,0.12)':'#fff1f2') : task.priority === 'medium' ? (isDark?'rgba(251,191,36,0.12)':'#fef3c7') : (isDark?'rgba(52,211,153,0.12)':'#d1fae5'),
              border: `1px solid ${task.priority === 'high' ? (isDark?'rgba(248,113,113,0.25)':'#fecaca') : task.priority === 'medium' ? (isDark?'rgba(251,191,36,0.25)':'#fcd34d') : (isDark?'rgba(52,211,153,0.25)':'#6ee7b7')}`,
            }}
          >
            {task.priority}
          </span>

          <h1 className="text-sm font-bold truncate max-w-xs" style={{ color: T.head }}>{task.title}</h1>
        </div>

        <StatusChanger
          currentStatus={status}
          onStatusChange={handleStatusChange}
          disabled={statusUpdating || timerRunning}
          isDark={isDark}
        />
      </div>

      <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div
            className="rounded-2xl p-5"
            style={{ background: T.cardBg, border: `1px solid ${T.cardBord}` }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: T.muted }}>Task Details</p>
            <h2 className="text-base font-extrabold mb-1 tracking-tight" style={{ color: T.head }}>{task.title}</h2>
            {task.description && (
              <p className="text-sm leading-relaxed mb-4" style={{ color: T.body }}>{task.description}</p>
            )}
            <div className="flex flex-wrap gap-3">
              {(task.due || task.due_date) && (
                <div className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg" style={{ color: T.muted, background: T.tagBg, border: `1px solid ${T.tagBord}` }}>
                  <Calendar size={11} style={{ color: '#a78bfa' }} />
                  Due {formatDate(task.due ?? task.due_date)}
                </div>
              )}
              {task.assignee && (
                <div className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg" style={{ color: T.muted, background: T.tagBg, border: `1px solid ${T.tagBord}` }}>
                  <User size={11} style={{ color: '#38bdf8' }} />
                  {task.assignee}
                </div>
              )}
              {task.category && (
                <div className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg" style={{ color: T.muted, background: T.tagBg, border: `1px solid ${T.tagBord}` }}>
                  <Tag size={11} style={{ color: '#fbbf24' }} />
                  {task.category}
                </div>
              )}
              {task.estimated_hours && (
                <div className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg" style={{ color: T.muted, background: T.tagBg, border: `1px solid ${T.tagBord}` }}>
                  <Clock size={11} style={{ color: '#34d399' }} />
                  Est. {task.estimated_hours}
                </div>
              )}
            </div>
          </div>

          <div
            className="rounded-2xl p-5"
            style={{ background: T.cardBg, border: `1px solid ${T.cardBord}` }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock size={13} style={{ color: '#a78bfa' }} />
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] m-0" style={{ color: T.muted }}>Time Tracker</p>
            </div>

            <Timer
              isRunning={timerRunning}
              onStart={handleStart}
              onStop={handleStop}
              startTime={pendingTimeLog?.started_at}
              endTime={toMilliseconds(task.estimated_hours)}
              isDark = {isDark}
              T = {T}
              />

            <TimeLogs 
              logs={timeLogs} 
              T={T} 
            />
          </div>

          {isDelayed ? (
            <div className="rounded-2xl p-5" style={{ background: T.cardBg, border: `1px solid ${T.cardBord}` }}>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle size={13} style={{ color: '#f87171' }} />
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] m-0" style={{ color: T.muted }}>Delay Reason</p>
              </div>

              <DelayReason 
                value={delayReason} 
                onChange={handleAddDelayReason} 
              />

            </div>
          ) : (
            <>
              <div className="rounded-2xl p-5" style={{ background: T.cardBg, border: `1px solid ${T.cardBord}` }}>
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare size={13} style={{ color: '#38bdf8' }} />
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] m-0" style={{ color: T.muted }}>
                    Comments <span style={{ color: T.muted }}>({comments.length})</span>
                  </p>
                </div>

                <Comments 
                  comments={comments} 
                  onAddComment={handleAddComment} 
                  currentUser={currentUser} 
                  isDark = {isDark}
                  T = {T}
                />

              </div>

              <div className="rounded-2xl p-5 max-h-[calc(100vh-140px)] overflow-y-auto" style={{ background: T.cardBg, border: `1px solid ${T.cardBord}` }}>
                <div className="flex items-center gap-2 mb-4">
                  <Paperclip size={13} style={{ color: '#fbbf24' }} />
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] m-0" style={{ color: T.muted }}>
                    Attachments <span style={{ color: T.muted }}>({attachments.length})</span>
                  </p>
                </div>

                <Attachments
                  attachments={attachments}
                  onUpload={handleStageFile}
                  uploading={uploading}
                  onCancel={handleCancelFile}
                  isDark = {isDark}
                  T = {T}
                />

              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-4 lg:sticky lg:top-6">
          <div className="rounded-2xl p-5" style={{ background: T.cardBg, border: `1px solid ${T.cardBord}` }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: T.muted }}>Summary</p>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between py-2 px-3 rounded-xl" style={{ background: T.tagBg, border: `1px solid ${T.tagBord}` }}>
                <span className="text-xs font-medium" style={{ color: T.body }}>Time Logs</span>
                <span className="text-xs font-bold" style={{ color: timeLogs.length > 0 ? '#a78bfa' : T.muted }}>{timeLogs.length}</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-xl" style={{ background: T.tagBg, border: `1px solid ${T.tagBord}` }}>
                <span className="text-xs font-medium" style={{ color: T.body }}>Comments</span>
                <span className="text-xs font-bold" style={{ color: comments.length > 0 ? '#38bdf8' : T.muted }}>{comments.length}</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-xl" style={{ background: T.tagBg, border: `1px solid ${T.tagBord}` }}>
                <span className="text-xs font-medium" style={{ color: T.body }}>Attachments</span>
                <span className="text-xs font-bold" style={{ color: attachments.length > 0 ? '#fbbf24' : T.muted }}>{attachments.length}</span>
              </div>
            </div>

            <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${T.divider}` }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: T.muted }}>Current Status</p>
              <span
                className="text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wide"
                style={{
                  color: status === 'completed' ? '#34d399' : status === 'in-progress' ? '#a78bfa' : T.muted,
                  background: status === 'completed' ? (isDark?'rgba(52,211,153,0.12)':'#d1fae5') : status === 'in-progress' ? (isDark?'rgba(139,92,246,0.12)':'#ede9fe') : T.tagBg,
                  border: `1px solid ${status === 'completed' ? (isDark?'rgba(52,211,153,0.25)':'#6ee7b7') : status === 'in-progress' ? (isDark?'rgba(139,92,246,0.25)':'#c4b5fd') : T.tagBord}`,
                }}
              >
                {status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ background: T.cardBg, borderTop: `1px solid ${T.divider}` }}
      >
        <p className="text-xs" style={{ color: T.muted }}>
          {hasPendingChanges
            ? `${timeLogs.length} time log${timeLogs.length !== 1 ? 's' : ''} pending`
            : 'No pending changes'}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            disabled={submitting}
            className="px-4 py-2 text-sm font-semibold rounded-xl cursor-pointer border-none transition-all duration-150"
            style={{ background: T.tagBg, color: T.muted, border: `1px solid ${T.tagBord}` }}
            onMouseEnter={e => e.currentTarget.style.background = T.rowHov}
            onMouseLeave={e => e.currentTarget.style.background = T.tagBg}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmitAll}
            disabled={submitting || !hasPendingChanges}
            className="px-5 py-2 text-sm font-bold text-white rounded-xl flex items-center gap-2 cursor-pointer border-none transition-all duration-150"
            style={{
              background: submitting || !hasPendingChanges ? (isDark?'rgba(139,92,246,0.30)':'#c4b5fd') : '#7c3aed',
              boxShadow: submitting || !hasPendingChanges ? 'none' : '0 4px 14px rgba(124,58,237,0.35)',
              cursor: submitting || !hasPendingChanges ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? (
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <><CheckCircle size={14} /> Submit All</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}