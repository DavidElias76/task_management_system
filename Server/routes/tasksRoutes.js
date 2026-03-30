import { Router } from "express";
import { upload } from "../databaseConfig/multerConfig.js";
import { 
    getTasksController, 
    AddTasksController, 
    updateTaskController, 
    deleteTasksController 
} from "../controllers/TasksController.js";
import { 
    getCommentsController, 
    getTimerLogsController, 
    getAttachmentsController, 
    getDelayReasonsController,
    downloadAttachmentController
} from '../controllers/tasksPanelController.js'
import { updateTaskStatusController } from "../controllers/statusChanger.js";
import { addTimeLogsController } from '../controllers/timelogsController.js';
import { addCommentsController } from '../controllers/commentsController.js';
import { addDelayReasonController } from '../controllers/delayReasonController.js';
import { addFilesController } from "../controllers/attachmentsController.js";

const router = Router();

router.get("/", getTasksController);
router.get('/comments', getCommentsController)
router.get('/timelogs', getTimerLogsController)
router.get('/delays', getDelayReasonsController)

router.get('/attachments', getAttachmentsController)
router.get('/attachments/:id/download', downloadAttachmentController)
router.post('/:id/attachments', upload.array('files'), addFilesController)

router.post('/add', AddTasksController);
router.post('/:id/timelogs', addTimeLogsController);
router.post('/:id/comments', addCommentsController);
router.post('/:id/delay', addDelayReasonController);
router.put('/:id/status', updateTaskStatusController);
router.put('/:id', updateTaskController);
router.delete('/:id', deleteTasksController);

export default router;