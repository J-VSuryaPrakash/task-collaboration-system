import {Router} from 'express';
import { registerUser, loginUser, logoutUser, updateUserDetails, updatePassword, getUser} from '../controllers/users.controller.js';
import verifyUser from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyUser,logoutUser);

router.route("/update-details").post(verifyUser,updateUserDetails);

router.route("/update-password").post(verifyUser,updatePassword);

router.route("/get-user").get(verifyUser,getUser);

export default router;