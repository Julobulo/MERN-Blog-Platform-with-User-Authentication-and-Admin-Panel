import UserModel from "../models/UserModel.js";
import createSecretToken from "../util/SecretToken.js";
import bcrypt from "bcryptjs";

export const Signup = async (req, res, next) => {
    try {
        const { email, password, username, createdAt } = req.body;
        if (!email || !password || !username) {
            res.status(400).json({ message: "Please include an email, a username and a password" });
        }
        const existingEmailUser = await UserModel.findOne({ email: email });
        const existingUsernameUser = await UserModel.findOne({ username: username });
        if (existingEmailUser || existingUsernameUser) {
            return res.json({ message: "User already exists" });
        }
        const user = await UserModel.create({ email, password, username });
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res
            .status(201)
            .json({ message: "User successfully Signed Up!", success: true, isAdmin: user.isAdmin });
        next();
    } catch (error) {
        console.error(error);
    }
};

export const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ message: 'All fields are required' })
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.json({ message: 'Incorrect password or email' })
        }
        const auth = await bcrypt.compare(password, user.password)
        if (!auth) {
            return res.json({ message: 'Incorrect password or email' })
        }
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res.status(201).json({ message: "User logged in successfully", success: true, isAdmin: user.isAdmin, isSuperAdmin: user.isSuperAdmin });
        next()
    } catch (error) {
        console.error(error);
    }
}

