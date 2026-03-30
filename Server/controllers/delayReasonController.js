
import { insertDelayReason } from "../models/delayReasonModel.js";

export const addDelayReasonController = async (req, res) => {
  const { id: taskId } = req.params;
  const { reason, username } = req.body;

  if (!reason || !username) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await insertDelayReason(taskId, username, reason);

    if (result.affectedRows) {
      res.status(201).json({ message: 'Delay reason saved successfully' });
    }
  } catch (err) {
    console.error("Error adding delay reason:", err);
    res.status(500).json({ error: err.message || "Failed to adding delay reasons" });
  }
};
