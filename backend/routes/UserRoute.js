import express from "express";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get('/', async (request, response) => {
    try {
        const token = request.cookies.token
        if (!token) {
          return response.json({ error: "cookie missing" })
        }
        jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
          if (err) {
           return response.json({ error: "bad cookie" })
          } else {
            const user = await User.findById(data.id);
            if (user) return response.json({ _id: user._id, email: user.email, username: user.username, isAdmin: user.isAdmin, profilePicture: user.profilePicture, date: user.createdAt })
            else return response.json({ error: "user missing" })
          }
        })
    }
    catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})

export default router