import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/UserModel.js";
import createSecretToken from "../util/SecretToken.js";
import session from "express-session";
dotenv.config();

const router = express.Router();
router.use(session({
    secret: process.env.TOKEN_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
router.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // callbackURL: "http://localhost:5555/oauth/google/callback"
    // callbackURL: "https://mern-blog-platform-with-user-authentication-and-admin-panel.vercel.app/oauth/google/callback",
    callbackURL: "https://blog-backend.jules.tf/oauth/google/callback",
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });

            if (!user) {
                console.log('creating user from google oauth')
                user = new User({
                    googleId: profile.id,
                    username: profile.displayName,
                    email: profile.emails[0].value,
                });
                await user.save();
            }

            const token = createSecretToken(user._id);
            const isAdmin = user.isAdmin;
            done(null, { user, token, isAdmin });
        } catch (error) {
            done(error, null);
        }
    }));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});



router.get('/google', (req, res, next) => {
    console.log('going to authenticate user using google oauth and passport library');
    passport.authenticate('google', { scope: ['profile', 'email'] });
}
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        console.log(`got callback from url: ${req.url}, for user: ${JSON.stringify(req.user)}`);
        // Successful authentication, redirect home with the token
        const token = req.user.token;
        console.log(`setting cookie to: ${token}`);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
            domain: 'blog.jules.tf',
            sameSite: 'None',
            secure: true,
        });
        const isAdmin = req.user.isAdmin;
        res.cookie("isAdmin", isAdmin, {
            withCredentials: true,
            httpOnly: false,
            domain: 'blog.jules.tf',
            sameSite: 'None',
            secure: true,
        });
        // res.redirect(`http://localhost:5173`);
        // res.redirect(`https://blog.jules.tf`);
        res.status(200).json({ message: 'successfully authenticated with google' })
    }
);

export default router