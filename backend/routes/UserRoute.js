import express from "express";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get('/', async (request, response) => {
    try {
        const token = request.cookies.token;
        if (!token) {
          return response.json({ error: "cookie missing" })
        }
        jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
          if (err) {
           return response.json({ error: "bad cookie" })
          } else {
            const user = await User.findById(data.id);
            if (user) return response.json({ _id: user._id, profilePicture: user.profilePicture, username: user.username, date: user.createdAt, bio: user.bio, email: user.email, isAdmin: user.isAdmin })
            else return response.json({ error: "user missing" })
          }
        })
    }
    catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})

router.post('/update', async (request, response) => {
    try {
        const { profilePicture, bio } = request.body;
        const maxSize = 1 * 1024 * 1024; // 1MB
        if (profilePicture) {
            const matches = profilePicture.match(/^data:image\/([a-zA-Z0-9]+);base64,([a-zA-Z0-9+/=]+)$/);
            if (!matches) {
                return response.status(400).json({ message: 'Invalid image format' });
            }
    
            const base64Data = matches[2];
            const buffer = Buffer.from(base64Data, 'base64');
            if (buffer.length > maxSize) {
                return response.status(400).json({ message: 'File size exceeds 1MB' });
            }
        }
        const token = request.cookies.token;
        if (!token) {
          return response.status(400).json({ error: "cookie missing" })
        }
        jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
          if (err) {
           return response.status(400).json({ error: "bad cookie" })
          } else {
            const user = await User.findById(data.id);
            user.profilePicture = profilePicture;
            user.bio = bio;
            user.save();
            return response.status(204).json({ message: "updated profilePicture and bio" });
          }
        })
    }
    catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})

router.get('/:id', async (request, response) => {
    const { id } = request.params;
    console.log(`/:id; id:${id}`);
})

export default router