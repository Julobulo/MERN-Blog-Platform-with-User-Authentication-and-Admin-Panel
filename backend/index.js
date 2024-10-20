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
    origin: [
        'http://localhost:5173',
        'https://mern-blog-platform-with-user-authentication-and-admin-panel.vercel.app',
        'https://mern-blog-platform-with-user-authentication-and-admin-panel.vercel.app/oauth/google/callback',
        'https://jules.tf',
        'https://blog.jules.tf',
        'https://api.blog.jules.tf',
        'https://api.blog.jules.tf/oauth/google/callback',
        'https://accounts.google.com',
        'https://accounts.google.com/o/oauth2/v2/auth',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-type', 'Access-Control-Allow-Origin'],
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
        await checkUsers();
        await checkArticles();
    })
    .catch((error) => {
        console.log(error)
    })

async function checkArticles() {
    try {
        const articles = await Article.find();
        for (let article of articles) {
            // creating author_name field in each article
            const author = await User.findById(article.author); // Find the user by _id
            if (author) {
                article.author_name = author.username;
                article.author_profilePicture = author.profilePicture;
            } else {
                article.author_name = "Unknown";
            }
            await article.save();
        }
        console.log('All article documents are correct');
    } catch (error) {
        console.error('Error checking articles:', error);
    }
}

async function checkUsers() {
    try {
        const users = await User.find();
        for (let user of users) {
            await user.save();
        }
        console.log('All user documents are correct');
    } catch (error) {
        console.error('Error checking or updating users:', error);
    }
}

app.post('/webhook/game/result', (request, response) => {
    console.log(`request looks like this: ${request.body}`);k
    return response.status(200);
})

app.use('/', AuthRoute)
app.use('/user', UserRoute)
app.use('/blog', BlogRoute)