import { Router } from 'express';
import {assignTask, updateTask, deleteTask, getTask} from '../controllers/tasks.controller.js';
import verifyUser from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/assign-task").post(verifyUser, assignTask);

router.route("/update-task").post(verifyUser, updateTask);

router.route("/delete-task").delete(verifyUser, deleteTask);

router.route("/get-task").get(verifyUser, getTask);


export default router;