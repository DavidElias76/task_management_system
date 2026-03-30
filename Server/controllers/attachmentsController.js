import { insertFile } from "../models/attachmentsModel.js";

export const addFilesController = async (req, res) => {
  const { id: taskId } = req.params;
  const { uploaded_by } = req.body;
  const files = req.files;
 
  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No files provided, try again" });
  }
 
  if (!uploaded_by) {
    return res.status(400).json({ message: "uploaded_by is required" });
  }
 
  try {
    const results = await Promise.all(
      files.map((file) =>
        insertFile(
          taskId,
          uploaded_by,
          file.originalname,
          file.buffer,
          file.size,
          file.mimetype
        )
      )
    );
    res.status(201).json({ message: "Files saved successfully", results });
  } catch (err) {
    console.error("Error adding files:", err);
    res.status(500).json({ error: err.message || "Failed to save files" });
  }
};