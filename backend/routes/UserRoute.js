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
            return response.status(400).json({ message: "cookie missing" })
        }
        jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
            if (err) {
                return response.status(400).json({ message: "bad cookie" })
            } else {
                const user = await User.findById(data.id);
                if (user) return response.status(200).json({ _id: user._id, profilePicture: user.profilePicture, username: user.username, date: user.createdAt, bio: user.bio, email: user.email, isAdmin: user.isAdmin, isSuperAdmin: user.isSuperAdmin })
                else return response.status(404).json({ message: "user missing" })
            }
        })
    }
    catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})

function validateDataToChange(_id, bio, date, email, isAdmin, profilePicture, username) {
    const maxPictureSize = 1 * 1024 * 1024; // 1MB
    if (profilePicture) {
        const matches = profilePicture.match(/^data:image\/([a-zA-Z0-9]+);base64,([a-zA-Z0-9+/=]+)$/);
        if (!matches) {
            return { allowed: false, message: 'Invalid image format' };
        }

        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        if (buffer.length > maxPictureSize) {
            return { allowed: false, message: 'File size exceeds 1MB' };
        }
    }
    const minBioLength = 10;
    const maxBioLength = 1000;
    if (bio) {
        if (bio.length < minBioLength || bio.length > maxBioLength) {
            return { allowed: false, message: `Bio must be less than ${maxBioLength} characters and greater than ${minBioLength} characters` };
        }
    }
    const minUsernameLength = 4;
    const maxUsernameLength = 20;
    if (username) {
        if (username.length < minUsernameLength || username.length > maxUsernameLength) {
            return { allowed: false, message: `Username must be less than ${maxUsernameLength} characters and greater than ${minUsernameLength} characters` }
        }
    }
    return { allowed: true };
}

router.post('/update', async (request, response) => {
    try {
        const { _id, bio, date, email, isAdmin, profilePicture, username } = request.body;
        const canValidate = validateDataToChange(_id, bio, date, email, isAdmin, profilePicture, username);
        if (!canValidate.allowed) {
            return response.status(400).json({ message: canValidate.message })
        }
        const token = request.cookies.token;
        if (!token) {
            return response.status(400).json({ message: "cookie missing" })
        }
        jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
            if (err) {
                return response.status(400).json({ message: "bad cookie" })
            } else {
                const user = await User.findById(data.id);
                // check if user is admin
                if (user.isAdmin) {
                    console.log('user is admin');
                    // if the user is an admin, he can change every fields of everyone (except superadmin)
                    const userToChange = await User.findById(_id); // get user by id that was passed
                    function strip(string) {
                        return string.replace(/^\s+|\s+$/g, '');
                    }
                    console.log(`_id: ${_id}, user._id: ${user._id}, strip(String(_id)) === strip(String(user._id)): ${strip(String(_id)) === strip(String(user._id))}`);
                    if (String(_id) === String(user._id)) {
                        // userToChange is the same as the admin who sent the request -> admin wants to change his own info
                        console.log(`admin "${user.username}" wants to change his own info!`);
                        user.bio = bio;
                        user.email = email;
                        user.isAdmin = isAdmin;
                        user.profilePicture = profilePicture;
                        user.username = username;
                        await user.save();
                        return response.status(200).json({ message: "successfully changed your info!" });
                    }
                    if (userToChange.isSuperAdmin || userToChange.isAdmin) {
                        // user is superadmin
                        return response.status(400).json({ message: "you can't change an admin's info" });
                    }
                    else {
                        // the user to change is neither the admin changing it nor him/herself an admin
                        console.log('the user to change is neither the admin changing it nor him/herself an admin');
                        userToChange.bio = bio;
                        userToChange.email = email;
                        userToChange.isAdmin = isAdmin;
                        userToChange.profilePicture = profilePicture;
                        userToChange.username = username;
                        await userToChange.save();
                        return response.status(200).json({ message: "successfully the regular user's info!" });
                    }
                }
                else {
                    // If the user isn't admin, then we can only change their own profile picture and bio
                    if (profilePicture) {
                        user.profilePicture = profilePicture;
                    }
                    if (bio) {
                        user.bio = bio;
                    }
                    user.save();
                    return response.status(200).json({ message: "updated profilePicture and bio" });
                }
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
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
        await delay(1000);
        const { author } = request.params;
        const wantedUser = await User.findOne({ username: author });
        if (!wantedUser) {
            return response.status(404).json({ message: "user doesn't exist" })
        }
        const token = request.cookies.token;
        if (!token) {
            return response.status(200).json({ profilePicture: wantedUser.profilePicture, username: wantedUser.username, date: wantedUser.createdAt, bio: wantedUser.bio, isAdmin: wantedUser.isAdmin, isSuperAdmin: wantedUser.isSuperAdmin })
        }
        console.log('There is a token');
        try {
            const data = jwt.verify(token, process.env.TOKEN_KEY);
            const user = await User.findById(data.id);
            if (user) {
                if (user.isAdmin) {
                    return response.status(200).json({ _id: wantedUser._id, profilePicture: wantedUser.profilePicture, username: wantedUser.username, email: wantedUser.email, date: wantedUser.createdAt, bio: wantedUser.bio, isAdmin: wantedUser.isAdmin, isSuperAdmin: wantedUser.isSuperAdmin })
                }
                else {
                    return response.status(200).json({ profilePicture: wantedUser.profilePicture, username: wantedUser.username, date: wantedUser.createdAt, bio: wantedUser.bio, isAdmin: wantedUser.isAdmin, isSuperAdmin: wantedUser.isSuperAdmin })
                }
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

export default router