
import { Router } from "express";
import { 
    addUsersController, 
    getUsersController, 
    updateUsersController, 
    deleteUsersController 
} from "../controllers/UsersController.js";

const router = Router(); 

router.get('/', getUsersController);
router.post('/add', addUsersController);
router.put('/:id', updateUsersController)
router.delete('/:id', deleteUsersController)

export default router;