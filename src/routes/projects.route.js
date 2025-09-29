import {Router} from 'express';
import {projectDetails, deleteProject, updateProject, getAllProjects} from "../controllers/projects.controller.js"
import verifyUser from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/add-project").post(verifyUser, projectDetails)

router.route("/delete-project").delete(verifyUser, deleteProject)

router.route("/update-project").post(verifyUser, updateProject)

router.route("/all-projects").get(verifyUser, getAllProjects)


export default router;