import express from "express";
import { Signup, Login } from "../Controllers/AuthController.js";
import OAuth from "./OAuth.js";
import userVerification from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.use('/oauth', OAuth);
router.post('/', userVerification);

export default router