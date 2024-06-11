import express, { response } from "express";
import User from "../models/UserModel.js";
import Article from "../models/ArticleModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get('/articles', async (request, response) => {
    try {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
        await delay(1000);
        const articles = await Article.find({}).limit(20); // Fetch articles excluding the image field
        const articlesData = articles.map(article => article.toObject()); // Convert documents to plain JavaScript objects
        return response.status(200).json(articlesData); // Send the plain JavaScript objects in the response
    }
    catch (error) {
        console.log(error);
        return response.status(500).json({ message: error });
    }
});

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
                // check user
                const user = await User.findById(data.id);
                if (!user) {
                    return response.status(400).json({ message: "you need to be logged in!"})
                }
                // check if there is an article with same title already
                const otherArticle = await Article.findOne({ title: title })
                if (otherArticle) {
                    return response.status(400).json({ message: "there is already an article with the same title"})
                }
                // check article
                const checkedArticle = checkArticle(image, title, subtitle, tags, main);
                if (!checkedArticle.allowed) {
                    return response.status(400).json({ message: checkedArticle.message })
                }
                // post article
                const newArticle = Article.create({ image, title, subtitle, tags, main });
                (await newArticle).save();
                response.status(201).json({ message: "successfully posted article!"});
            }
        })
    }
    catch (error) {
        console.log(error)
        return response.status(500).json({ message: error })
    }
})

export default router