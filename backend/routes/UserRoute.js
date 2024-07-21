import express from "express";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Article from "../models/ArticleModel.js";

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
                return response.status(401).json({ message: "bad cookie" })
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

const updateAuthorNameInArticles = async (userId, newUsername) => {
    try {
        await Article.updateMany(
            { author: userId },
            { $set: { author_name: newUsername } }
        );
    } catch (error) {
        console.error(`Error updating articles for user ${userId}:`, error);
    }
};


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
                return response.status(401).json({ message: "bad cookie" })
            } else {
                const user = await User.findById(data.id);
                // check if user is admin
                if (user.isAdmin) {
                    // if the user is an admin, he can change every fields of everyone (except superadmin)
                    const userToChange = await User.findById(_id); // get user by id that was passed
                    if (String(_id) === String(user._id)) {
                        // userToChange is the same as the admin who sent the request -> admin wants to change his own info
                        user.bio = bio;
                        user.email = email;
                        user.isAdmin = isAdmin;
                        user.profilePicture = profilePicture;
                        if (user.username !== username) {
                            user.username = username;
                            updateAuthorNameInArticles(user._id, username);
                        }
                        await user.save();
                        return response.status(200).json({ message: "successfully changed your info!" });
                    }
                    if (userToChange.isSuperAdmin || userToChange.isAdmin) {
                        // if user is admin or super admin -> only super admin can change his info
                        if (user.isSuperAdmin) {
                            userToChange.bio = bio;
                            userToChange.email = email;
                            userToChange.isAdmin = isAdmin;
                            userToChange.profilePicture = profilePicture;
                            if (user.username !== username) {
                                userToChange.username = username;
                                updateAuthorNameInArticles(userToChange._id, username);
                            }
                            await userToChange.save();
                            return response.status(200).json({ message: "successfully changed the admin's info!" });
                        }
                        else {
                            return response.status(400).json({ message: "you can't change an admin's info" });
                        }
                    }
                    else {
                        // the user to change is neither the admin changing it nor him/herself an admin
                        userToChange.bio = bio;
                        userToChange.email = email;
                        userToChange.isAdmin = isAdmin;
                        userToChange.profilePicture = profilePicture;
                        if (user.username !== username) {
                            userToChange.username = username;
                            updateAuthorNameInArticles(userToChange._id, username);
                        }
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
                    if (user.isAdmin != isAdmin) {
                        user.isAdmin = isAdmin; // NOTE: normally, this should not be here. However, for demonstration purposes, I'm allowing
                        // users to change their rights
                        user.save();
                        return response.status(200).json({ message: "updated profile. Please log out and login again for changes to take effect" });
                    }
                    user.save();
                    return response.status(200).json({ message: "updated profile" });
                }
            }
        })
    }
    catch (error) {
        console.log(error);
        response.status(500).send({ message: error });
    }
})

router.delete('/delete', async (request, response) => {
    try {
        const { _id, bio, date, email, isAdmin, profilePicture, username } = request.body;
        const token = request.cookies.token;
        if (!token) {
            return response.status(400).json({ message: "cookie missing" })
        }
        jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
            if (err) {
                return response.status(401).json({ message: "bad cookie" })
            } else {
                const user = await User.findById(data.id);
                // check if user is admin
                if (user.isSuperAdmin) {
                    // if the user is an admin, he can change every fields of everyone (except superadmin)
                    const userToDelete = await User.findById(_id); // get user by id that was passed
                    if (userToDelete.isSuperAdmin) {
                        return response.status(400).json({ message: "you can't delete a super admin!" })
                    }
                    await User.deleteOne({ _id: userToDelete._id });
                    console.log('deleted user');
                    return response.status(200).json({ message: "successfully deleted user" });
                }
                else {
                    return response.status(400).json({ message: "you have to be super admin to delete a user" });
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
            return response.status(400).json({ message: "cookie missing" })
        }
        try {
            const data = jwt.verify(token, process.env.TOKEN_KEY);
            const user = await User.findById(data.id);
            if (user) {
                if (user.isAdmin) {
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
                    return response.status(200).json(users);
                } else {
                    return response.status(400).json({ message: "you are not administrator" });
                }
            } else {
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

const changeUserPassword = async (userId, newPassword) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await User.findByIdAndUpdate(userId, { password: hashedPassword });
        console.log(`Password updated successfully for user '${user.username}'`);
    } catch (error) {
        console.error('Error updating password:', error);
    }
};

// this route will update a user's password
router.put('/password/:author', async (request, response) => {
    const { author } = request.params;
    const { newPassword } = request.body;
    const token = request.cookies.token;
    if (!token) {
        return response.status(400).json({ message: "you need to be authenticated to perform this operation" })
    }
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        if (err) {
            return response.status(401).json({ message: "bad cookie" })
        } else {
            const user = await User.findById(data.id);
            if (user.isSuperAdmin) { // we can perform this operation only if superadmin
                const userToChangePassword = await User.findOne({ username: author }); // get user by the username that was passed using the params
                if (userToChangePassword) {
                    await changeUserPassword(userToChangePassword._id, newPassword);
                    return response.status(200).json({ message: `successfully changed password of user '${userToChangePassword.username}'` });
                }
                else {
                    return response.status(400).json({ message: "couldn't find the user" })
                }
            }
            else {
                return response.status(400).json({ message: "you have to be super admin to change a user's password" });
            }
        }
    })
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