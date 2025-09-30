import { Router } from "express";
import { addComment } from "../controllers/comments.controller.js";
import verifyUser from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add-comment").post(verifyUser, addComment);

export default router;