import express from "express";
import { Signup, Login } from "../Controllers/AuthController.js";
import userVerification from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.post('/', userVerification);

export default router