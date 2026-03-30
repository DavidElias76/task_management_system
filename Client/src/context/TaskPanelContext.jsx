import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const TaskPanelContext = createContext();
const BASE_URL = "http://localhost:8080";

export default function TaskPanelProvider({ children }) {
  const [comments, setComments] = useState([]);
  const [timerLogs, setTimerLogs] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [delays, setDelayReasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/tasks/comments`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTimer = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/tasks/timelogs`);
      setTimerLogs(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch timer logs");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAttachments = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/tasks/attachments`);
      setAttachments(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch attachments");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDelayReasons = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/tasks/delays`);
      setDelayReasons(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch delay reasons");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
    fetchAttachments();
    fetchTimer();
    fetchDelayReasons();
  }, []);

  return (
    <TaskPanelContext.Provider value={{
      comments, timerLogs, attachments, delays, loading, error,
      refetchComments: fetchComments,
      refetchTimer: fetchTimer,
      refetchAttachments: fetchAttachments,
      refetchDelays: fetchDelayReasons,
    }}>
      {children}
    </TaskPanelContext.Provider>
  );
}

export { TaskPanelContext };