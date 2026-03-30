import { insertComment} from "../models/commentsModel.js";

export const addCommentsController = async (req, res) => {
  const { id: taskId } = req.params;
  const { comments } = req.body;

  if (!comments || comments.length === 0) {
    return res.status(400).json({ message: 'No comments provided' });
  }

  try {
    const results = await Promise.all(
      comments.map(comment => {
        const { body, username } = comment;

        if (!body || !username) {
          throw new Error('Missing required fields in comment');
        }

        console.log(taskId, username, body)
        return insertComment(taskId, username, body);
      })
    );

    res.status(201).json({ message: 'Comments saved successfully', results });
  } catch (err) {
    console.error("Error adding comments:", err);
    res.status(500).json({ error: err.message || 'Failed to add comments' });
  }
};