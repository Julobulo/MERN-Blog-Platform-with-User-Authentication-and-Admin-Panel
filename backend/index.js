import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import AuthRoute from "./routes/AuthRoute.js";
import UserRoute from "./routes/UserRoute.js"
import BlogRoute from "./routes/BlogRoute.js";
import cookieParser from "cookie-parser";
import User from "./models/UserModel.js";
import bodyParser from "body-parser";
import Article from "./models/ArticleModel.js";
dotenv.config();
const { PORT, DB_URL } = process.env;

const app = express();
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

// Middleware for handling CORS POLICY
// Option 1: Allow ALL Origins with Default of cors(*)
// app.use(cors());
// Option 2:
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-type'],
}));
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

app.get('/', (request, response) => {
    console.log("there was a get request on /");
    return response
        .status(200)
        .send("Welcome to my webpage!")
})

// Function to check and create a super admin
async function checkAndCreateSuperAdmin() {
    try {
        const superAdmins = await User.find({ isSuperAdmin: true });

        if (superAdmins.length === 0) {
            console.error('No super admins found. Creating a new super admin.');

            const randomPassword = Math.random().toString(36).slice(-8);

            const newSuperAdmin = new User({
                username: 'admin',
                email: 'admin@admin.com',
                password: randomPassword,
                isSuperAdmin: true,
                isAdmin: true
            });

            await newSuperAdmin.save();

            console.log(`Super admin created with username: 'admin' and email: 'admin@admin.com'`);
            console.log(`The randomly generated password is: ${randomPassword}`);
        } else if (superAdmins.length === 1) {
            console.log('You have a super admin!');
        } else {
            console.warn('Be careful, this blog wasn\'t built so that there would be several super admins! By having several super admins, you expose yourself to unexpected bugs!');
        }
    } catch (error) {
        console.error('Error checking or creating super admin:', error);
    }
}

mongoose
    .connect(DB_URL)
    .then(async () => {
        console.log("App connected to database");
        await checkAndCreateSuperAdmin();
        app.listen(PORT, () => {
            console.log(`App is listening on port: ${PORT}`);
        });
        updateArticlesWithAuthorName()
    })
    .catch((error) => {
        console.log(error)
    })

async function updateArticlesWithAuthorName() {
    // Find all articles that do not have the author_name field
    const articlesWithoutAuthorName = await Article.find({ author_name: { $exists: false } });

    for (let article of articlesWithoutAuthorName) {
        const authorId = article.author;

        // Find the user with the given author ID
        const user = await User.findById(authorId);

        if (user) {
            // Update the article with the author's username
            article.author_name = user.username;
            await article.save();
            console.log(`Updated article ${article._id} with author_name ${user.username}`);
        } else {
            console.warn(`User with ID ${authorId} not found for article ${article._id}`);
        }
    }
    if (articlesWithoutAuthorName.length) {
        console.log('Update completed');
    }
    else {
        console.log('No articles without author_name fields')
    }
}

app.use('/', AuthRoute)
app.use('/user', UserRoute)
app.use('/blog', BlogRoute)