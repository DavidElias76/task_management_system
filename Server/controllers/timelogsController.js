import { insertTimeLogs } from "../models/timeLogsModel.js"

export const addTimeLogsController = async (req, res) => {
  const { id: taskId } = req.params;
  const { logs } = req.body;

  if (!logs || logs.length === 0) {
    return res.status(400).json({ message: 'No time logs provided' });
  }

  try {
    const results = await Promise.all(
      logs.map(log => {
        const { username, started_at, ended_at, duration_minutes, note, created_at } = log;

        console.log("processing log:", { username, started_at, ended_at, duration_minutes, note, created_at });

        if (!username || !started_at || !ended_at || !duration_minutes || !note || !created_at) {
          throw new Error('Missing required fields in log entry');
        }

        return insertTimeLogs(taskId, username, started_at, ended_at, duration_minutes, note, created_at);
      })
    );

    res.status(201).json({ message: 'Time logs saved', results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to save time logs' });
  }
};