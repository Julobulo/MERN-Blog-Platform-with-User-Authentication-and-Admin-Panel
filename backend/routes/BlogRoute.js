import express, { response } from "express";
import User from "../models/UserModel.js";
import Article from "../models/ArticleModel.js";
import jwt from "jsonwebtoken";
import util from "util";

const router = express.Router();
const verifyToken = util.promisify(jwt.verify);

// gets most liked article
router.get('/most-liked', async (request, response) => {
    try {
        // const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
        // await delay(1000);
        let mostLovedArticle = await Article.findOne({}).sort({ likes: -1 });
        if (!mostLovedArticle) {
            return response.status(404).json({ message: "no articles found" })
        }
        try {
            // send "liked" field
            const token = request.cookies.token;
            if (token) {
                jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
                    if (err) {
                        return response.status(200).json(mostLovedArticle);
                    } else {
                        const userRequesting = await User.findById(data.id);
                        if (userRequesting.articlesLiked.includes(mostLovedArticle._id)) {
                            mostLovedArticle = { ...mostLovedArticle.toObject(), liked: true };
                        }
                        return response.status(200).json(mostLovedArticle);
                    }
                })
            }
            else {
                return response.status(200).json(mostLovedArticle);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            mostLovedArticle.author = "Unknown"; // If error occurs, set author to "Unknown" or handle it as needed
            return response.status(200).json(mostLovedArticle);
        }
    }
    catch (error) {
        console.log(error);
        return response.status(500).json({ message: error });
    }
});

// gets most recent article
router.get('/most-recent', async (request, response) => {
    try {
        // const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
        // await delay(1000);
        let mostRecentArticle = await Article.findOne({}).sort({ date: -1 });
        if (!mostRecentArticle) {
            return response.status(404).json({ message: "no articles found" })
        }
        try {
            // send "liked" field
            const token = request.cookies.token;
            if (token) {
                jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
                    if (err) {
                        return response.status(200).json(mostRecentArticle);
                    } else {
                        const userRequesting = await User.findById(data.id);
                        if (userRequesting.articlesLiked.includes(mostRecentArticle._id)) {
                            mostRecentArticle = { ...mostRecentArticle.toObject(), liked: true };
                        }
                        return response.status(200).json(mostRecentArticle);
                    }
                })
            }
            else {
                return response.status(200).json(mostRecentArticle);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            mostRecentArticle.author = "Unknown"; // If error occurs, set author to "Unknown" or handle it as needed
            return response.status(200).json(mostRecentArticle);
        }
    }
    catch (error) {
        console.log(error);
        return response.status(500).json({ message: error });
    }
});

router.get('/3-latest', async (request, response) => {
    const threeLatest = await Article.find({}).sort({ date: -1 }).limit(3);
    return response.json(threeLatest);
})

router.get('/articles', async (request, response) => {
    try {
        // const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
        // await delay(1000);
        const skip = parseInt(request.query.skip) || 0;
        const limit = 4;
        const searchQuery = request.query.search;
        let filter = {};
        if (searchQuery && searchQuery.trim() !== '') {
            filter = {
                $or: [
                    { title: { $regex: searchQuery, $options: 'i' } },
                    { subtitle: { $regex: searchQuery, $options: 'i' } },
                    { author_name: { $regex: searchQuery, $options: 'i' } },
                    { tags: { $elemMatch: { $regex: searchQuery, $options: 'i' } } },
                ]
            };
        }
        const articles = await Article.find(filter).skip(skip).limit(limit); // Fetch articles
        const articlesData = [];
        const token = request.cookies.token;
        let userRequesting = '';
        if (token) {
            try {
                const data = await verifyToken(token, process.env.TOKEN_KEY);
                userRequesting = await User.findById(data.id);
            }
            catch (error) {
                console.log(error)
            }
        }
        // Iterate through each article
        for (const article of articles) {
            let articleObj = article.toObject(); // Convert Mongoose document to plain JavaScript object

            // Assuming you have a User model and each article has an author field pointing to the user's _id
            try {
                const user = await User.findById(article.author); // Find the user by _id
                if (user) {
                    articleObj.author = user.username; // Replace author with the username
                } else {
                    articleObj.author = "Unknown"; // If user not found, set author to "Unknown" or handle it as needed
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                articleObj.author = "Unknown"; // If error occurs, set author to "Unknown" or handle it as needed
            }
            // added "liked" field
            if (userRequesting) {
                articleObj = { ...articleObj, liked: userRequesting.articlesLiked.includes(articleObj._id) };
            }

            articlesData.push(articleObj); // Push modified article object to the array
        }
        return response.status(200).json(articlesData); // Send the plain JavaScript objects in the response
    }
    catch (error) {
        console.log(error);
        return response.status(500).json({ message: error });
    }
});

router.get('/article/:title', async (request, response) => {
    try {
        // const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
        // await delay(1000);
        const { title } = request.params;
        let article = await Article.findOne({ title: title });
        if (!article) {
            return response.status(404).json({ message: "article not found" })
        }
        const user = await User.findById(article.author); // Find the user by _id
        if (user) {
            article.author = user.username; // Replace author with the username
        } else {
            article.author = "Unknown"; // If user not found, set author to "Unknown" or handle it as needed
        }
        const token = request.cookies.token;
        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
                if (err) {
                    return response.status(401).json({ message: "bad cookie" })
                } else {
                    const userRequesting = await User.findById(data.id);
                    if (userRequesting.articlesLiked.includes(article._id)) {
                        article = { ...article.toObject(), liked: true };
                    }
                    return response.status(200).json(article);
                }
            })
        }
        else {
            return response.status(200).json(article);
        }
    }
    catch (error) {
        console.log(error);
        return response.status(500).json({ message: error });
    }
});

// this route allows users to like an article
router.post('/article/:title', async (request, response) => {
    try {
        const { title } = request.params;
        const article = await Article.findOne({ title: title });
        if (!article) {
            return response.status(404).json({ message: "article not found" })
        }
        const token = request.cookies.token;
        if (!token) {
            return response.status(400).json({ message: "cookie missing" })
        }
        jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
            if (err) {
                return response.status(401).json({ message: "bad cookie" })
            } else {
                const user = await User.findById(data.id);
                // add article title to user's articlesLiked
                if (user.articlesLiked.includes(article._id)) {
                    user.articlesLiked.pull(article._id);
                    await user.save();
                    article.likes -= 1;
                    await article.save();
                    return response.status(200).json({ message: "un-liked this article" })
                }
                else {
                    user.articlesLiked.push(article._id);
                    await user.save();
                    article.likes += 1;
                    await article.save();
                    return response.status(200).json({ message: "liked article" })
                }
            }
        })
    }
    catch (error) {
        console.log(error);
        return response.status(500).json({ message: error });
    }
});

function checkArticle({ image, title, subtitle, tags, main }) {
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
    if (title.length > 200 || title.length < 10) {
        return { allowed: false, message: "The title has to be between 10 and 200 characters" };
    }
    // checking tags
    const invalidTag = tags.find(tag => tag.length < 2 || tag.length > 20);
    if (invalidTag) {
        return { allowed: false, message: "Tags have to be between 2 and 20 characters" };
    }
    // checking main
    if (main.length > 1000) {
        return { allowed: false, message: "Article can't have more than 1000 blocks" };
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
                return response.status(401).json({ message: "bad cookie" })
            } else {
                const { image, blocks, tags } = request.body;
                // check user
                const user = await User.findById(data.id);
                if (!user) {
                    return response.status(400).json({ message: "you need to be logged in!" })
                }
                // check if there is an article with same title already
                const otherArticle = await Article.findOne({ title: blocks[0].content[0].text })
                if (otherArticle) {
                    return response.status(400).json({ message: "there is already an article with the same title" })
                }
                // check article
                const checkedArticle = checkArticle(
                    {
                        image: image,
                        main: blocks,
                        tags: tags,
                        title: blocks[0].content[0].text,
                        subtitle: blocks[1].content[0].text,
                    }
                );
                if (!checkedArticle.allowed) {
                    return response.status(400).json({ message: checkedArticle.message })
                }
                // post article
                const newArticle = Article.create({
                    image: image,
                    title: blocks[0].content[0].text,
                    subtitle: blocks[1].content[0].text,
                    tags: tags,
                    main: blocks,
                    author: data.id,
                    author_name: (await User.findById(data.id)).username,
                    author_profilePicture: (await User.findById(data.id)).profilePicture,
                });
                (await newArticle).save();
                response.status(201).json({ message: "successfully posted article!" });
            }
        })
    }
    catch (error) {
        console.log(error)
        return response.status(500).json({ message: error })
    }
})

router.get('/adminpanel', async (request, response) => {
    // const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    // await delay(1000);
    const token = request.cookies.token;
    if (!token) {
        return response.status(400).json({ message: "cookie missing" })
    }
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        if (err) {
            return response.status(401).json({ message: "bad cookie" })
        } else {
            const user = await User.findById(data.id);
            if (user && user.isAdmin) {
                const skip = parseInt(request.query.skip) || 0;
                const limit = 2;
                const searchQuery = request.query.search;
                let filter = {};
                if (searchQuery && searchQuery.trim() !== '') {
                    filter = {
                        $or: [
                            { title: { $regex: searchQuery, $options: 'i' } },
                            { subtitle: { $regex: searchQuery, $options: 'i' } },
                            { author_name: { $regex: searchQuery, $options: 'i' } },
                            { tags: { $elemMatch: { $regex: searchQuery, $options: 'i' } } },
                        ]
                    };
                }
                const articles = await Article.find(filter).skip(skip).limit(limit);
                return response.status(200).json(articles);
            } else {
                return response.status(401).json({ message: "user doesn't exist/isn't administrator" })
            }
        }
    })
})

router.delete('/delete/:title', async (request, response) => {
    const { title } = request.params;
    const token = request.cookies.token;
    if (!token) {
        return response.status(401).json({ message: "cookie missing" })
    }
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        if (err) {
            return response.status(401).json({ message: "bad cookie" })
        }
        const user = await User.findById(data.id);
        if (!user.isAdmin) {
            return response.status(403).json({ message: "you can't perform that action" })
        }
        const article = await Article.findOne({ title });
        if (!article) {
            return response.status(404).json({ message: "article doesn't exist" })
        }
        await Article.deleteOne({ _id: article._id });
        console.log
        return response.status(204).json({ message: "the article was successfully deleted" });
    })
})

router.get('/author/:author', async (request, response) => {
    const { author } = request.params;
    const user = await User.findOne({ username: author });
    if (!user) {
        return response.status(404).json({ message: "user not found" })
    }
    const articles = await Article.find({ author: user._id }).sort({ likes: -1 }).limit(5);
    const token = request.cookies.token;
    if (token) {
        jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
            if (err) {
                return response.status(200).json(articles);
            } else {
                const userRequesting = await User.findById(data.id);
                articles.forEach(article => {
                    if (userRequesting.articlesLiked.includes(article._id)) {
                        article.liked = true;
                    }
                })
                return response.status(200).json(articles);
            }
        })
    }
    else {
        return response.status(200).json(articles);
    }
})

router.get('/related/:title', async (request, response) => {
    const { title } = request.params;
    const article = await Article.findOne({ title: title });
    if (!article) {
        return response.status(404).json({ message: "article not found" });
    }
    const tags = article.tags;
    const relatedArticles = await Article.find({ tags: { $in: tags }, _id: { $ne: article._id } },
        // { _id: 0, image: 0, subtitle: 0, main: 0, author: 0, author_name: 0, likes: 0, date: 0, __v: 0 }
    ).sort({ likes: -1 }).limit(4);
    const token = request.cookies.token;
    if (token) {
        jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
            if (err) {
                return response.status(200).json(relatedArticles);
            } else {
                const userRequesting = await User.findById(data.id);
                relatedArticles.forEach(article => {
                    if (userRequesting.articlesLiked.includes(article._id)) {
                        article.liked = true;
                    }
                })
                return response.status(200).json(relatedArticles);
            }
        })
    }
    else {
        return response.status(200).json(relatedArticles);
    }
});

router.patch('/edit/:id', async (request, response) => {
    console.log(`going to edit an article`);
    const { id } = request.params;
    if (!id) {
        return response.status(400).json({ message: "id param is required" });
    }
    const article = await Article.findById(id);
    if (!article) {
        return response.status(400).json({ message: "article not found" })
    }
    const { image, blocks, tags } = request.body;
    const token = request.cookies.token;
    if (!token) {
        return response.status(401).json({ message: "you need to be logged in" })
    }
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        if (err) {
            return response.status(401).json({ message: "bad cookie" })
        } else {
            const user = await User.findById(data.id);
            if (!user.isAdmin) {
                return response.status(401).json({ message: "you need to be an admin to perform this action" })
            }
            article.image = image;
            article.blocks = blocks;
            article.tags = tags;
            article.save();
            return response.status(200).json({ message: "article successfully edited" });
        }
    })
})

export default router