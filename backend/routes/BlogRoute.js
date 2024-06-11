import express, { response } from "express";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

function checkArticle(image, title, subtitle, tags, main) {
    const maxPictureSize = 1 * 1024 * 1024; // 1MB
    if (!image || !title || !subtitle || !tags || tags.length < 1 || !main) {
        return { allowed: false, message: "you need to send all of the required fields: image, title, subtitle, tags, main" };
    }
    // checking image
    const matches = image.match(/^data:image\/([a-zA-Z0-9]+);base64,([a-zA-Z0-9+/=]+)$/);
    if (!matches) {
        return { allowed: false, message: 'Invalid image format' };
    }
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    if (buffer.length > maxPictureSize) {
        return { allowed: false, message: 'File size exceeds 1MB' };
    }
    // checking title and subtitle
    if (title.length > 100 || title.length < 10 || subtitle.length > 150 || subtitle.length < 30) {
        return { allowed: false, message: "The title has to be between 10 and 70 characters, and the subtitle has to be between 30 and 150 characters." };
    }
    // checking tags
    const invalidTag = tags.find(tag => tag.length < 2 || tag.length > 20);
    if (invalidTag) {
        return { allowed: false, message: "Tags have to be between 2 and 20 characters" };
    }
    // checking main
    if (main.length < 300 || main.length > 10000) {
        return { allowed: false, message: "the main article has to be between 300 and 10000 characters" };
    }
    return { allowed: true };
}

router.post('/new', async (request, response) => {
    try {
        const token = request.cookies.token;
        if (!token) {
            return response.status(400).json({ message: "cookie missing" })
        }
        jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
            if (err) {
                return response.status(400).json({ message: "bad cookie" })
            } else {
                const { image, title, subtitle, tags, main } = request.body;
                const checkedArticle = checkArticle(image, title, subtitle, tags, main);
                if (!checkArticle.allowed) {
                    return response.status(400).json({ message: checkedArticle.message })
                }
                const user = await User.findById(data.id);
            }
        })
    }
    catch (error) {
        console.log(error)
        return response.status(500).json({ message: error })
    }
})

export default router