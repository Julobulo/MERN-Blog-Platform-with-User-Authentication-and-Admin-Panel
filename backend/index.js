import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import AuthRoute from "./routes/AuthRoute.js";
import cookieParser from "cookie-parser";
dotenv.config();
const { PORT, DB_URL } = process.env;

const app = express();

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

mongoose
    .connect(DB_URL)
    .then(() => {
        console.log("App connected to database");
        app.listen(PORT, () => {
            console.log(`App is listening on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error)
    })


app.use('/', AuthRoute)