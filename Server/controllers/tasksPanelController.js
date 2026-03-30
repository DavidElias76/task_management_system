import pool from "../databaseConfig/database.js";

export const getCommentsController = async (req, res) => {
    try{
        const [rows] = await pool.query(`SELECT * FROM comments`)
        return res.status(200).json(rows)      
    }catch(err) {
        console.log(err)
        res.status(500).json({message: 'Unable to get the comments'})
    }
}

export const getTimerLogsController = async (req, res) => {
     try{
        const [rows] = await pool.query(`SELECT * FROM time_logs`)
        return res.status(200).json(rows)      
    }catch(err) {
        console.log(err)
        res.status(500).json({message: 'Unable to get the timelogs'})
    }
}

export const downloadAttachmentController = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT file_name, file_data, mime_type FROM attachments WHERE id = ?`,
      [id]
    );
 
    if (!rows.length) {
      return res.status(404).json({ message: "Attachment File not found" });
    }
 
    const { file_name, file_data, mime_type } = rows[0];
 
    res.setHeader("Content-Type", mime_type ?? "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(file_name)}"`
    );
     return res.send(file_data);
  } catch (err) {
    console.error("Error downloading attachment:", err);
    return res.status(500).json({ message: "Failed to download attachment" });
  }
};


export const getAttachmentsController = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, task_id, uploaded_by, file_name, file_size, mime_type 
       FROM attachments`
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching attachments:", err);
    return res.status(500).json({ message: "Unable to get the attachments" });
  }
};

export const getDelayReasonsController = async (req, res) => {
    try{
        const [rows] = await pool.query(`SELECT * FROM delay_reasons`)
        return res.status(200).json(rows)      
    }catch(err) {
        console.log(err)
        res.status(500).json({message: 'Unable to get the delay reasons'})
    }
}