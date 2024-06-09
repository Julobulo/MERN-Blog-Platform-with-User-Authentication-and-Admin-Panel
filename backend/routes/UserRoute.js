import express from "express";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get('/', async (request, response) => {
    try {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
        await delay(1000);
        const token = request.cookies.token;
        if (!token) {
            return response.status(400).json({ error: "cookie missing" })
        }
        jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
            if (err) {
                return response.status(400).json({ error: "bad cookie" })
            } else {
                const user = await User.findById(data.id);
                if (user) return response.status(200).json({ _id: user._id, profilePicture: user.profilePicture, username: user.username, date: user.createdAt, bio: user.bio, email: user.email, isAdmin: user.isAdmin })
                else return response.status(404).json({ error: "user missing" })
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
        const maxPictureSize = 1 * 1024 * 1024; // 1MB
        if (profilePicture) {
            const matches = profilePicture.match(/^data:image\/([a-zA-Z0-9]+);base64,([a-zA-Z0-9+/=]+)$/);
            if (!matches) {
                return response.status(400).json({ message: 'Invalid image format' });
            }

            const base64Data = matches[2];
            const buffer = Buffer.from(base64Data, 'base64');
            if (buffer.length > maxPictureSize) {
                return response.status(400).json({ message: 'File size exceeds 1MB' });
            }
        }
        const minBioLength = 10;
        const maxBioLength = 1000; // Example: 1000 characters
        if (bio) {
            if (bio.length < minBioLength || bio.length > maxBioLength) {
                return response.status(400).json({ message: `Bio must be less than ${maxBioLength} characters and greater than ${minBioLength} characters` });
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
                if (profilePicture) {
                    user.profilePicture = profilePicture;
                }
                if (bio) {
                    user.bio = bio;
                }
                user.save();
                return response.status(204).json({ message: "updated profilePicture and bio" });
            }
        })
    }
    catch (error) {
        console.log(error);
        response.status(500).send({ message: error });
    }
})

router.get('/adminpanel', async (request, response) => {
    try {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
        await delay(1000);
        const token = request.cookies.token;
        if (!token) {
            console.log('There is no token');
            return response.status(400).json({ message: "cookie missing" })
        }
        console.log('There is a token');
        try {
            const data = jwt.verify(token, process.env.TOKEN_KEY);
            console.log('The token is good');

            const user = await User.findById(data.id);
            if (user) {
                console.log('There is a user');
                if (user.isAdmin) {
                    console.log('The user is an admin');
                    // The user is an administrator, so he/she can request all of the users in the database
                    const skip = parseInt(request.query.skip) || 0; // Number of users to skip
                    const limit = 2; // Number of users per request

                    const searchQuery = request.query.search;
                    let filter = {};

                    if (searchQuery && searchQuery.trim() !== '') {
                        filter = {
                            $or: [
                                { username: { $regex: searchQuery, $options: 'i' } },
                                { email: { $regex: searchQuery, $options: 'i' } },
                                { bio: { $regex: searchQuery, $options: 'i' } }
                            ]
                        };
                    }

                    const users = await User.find(filter, { password: 0 }).skip(skip).limit(limit);
                    // const users = await User.find({}, { password: 0 }).skip(skip).limit(limit);
                    response.status(200).json(users);
                } else {
                    console.log('The user is not an admin');
                    return response.status(400).json({ message: "you are not administrator" });
                }
            } else {
                console.log('There is no user');
                return response.status(404).json({ message: "user missing" });
            }
        } catch (error) {
            console.log(error.message);
            return response.status(500).json({ message: error.message });
        }
    }
    catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})

router.get('/:author', async (request, response) => {
    try {
        const { author } = request.params;
        const user = await User.findOne({ username: author });
        if (!user) {
            return response.status(404).json({ error: "user doesn't exist" })
        }
        return response.status(200).json({ profilePicture: user.profilePicture, username: user.username, date: user.createdAt, bio: user.bio, isAdmin: user.isAdmin })
    }
    catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})

export default router