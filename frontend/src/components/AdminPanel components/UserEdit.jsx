import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";
import { toast } from "react-toastify";

const UserEdit = () => {
    const { author } = useParams();
    useEffect(() => {
        document.title = `AdminPanel - Edit User - ${author}`;
    }, [author]);
    // To be able to navigate to other pages
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/user/${author}`,
            { withCredentials: true }
        )
            .then((response) => {
                setLoading(false);
                // const { _id, email, username, isAdmin, profilePicture } = response.data;
                setUserData(response.data);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
                // Sample data for testing
                setUserData({
                    imgSrc: 'https://via.placeholder.com/64',
                    username: 'username',
                    date: 'January 1, 2000',
                    bio: 'bio',
                    email: 'email',
                    isAdmin: false,
                });
                toast.error(`Couldn't fetch the data...`);
            }
            )
    }, [setUserData]);

    const handleUsernameChange = (event) => {
        setUserData(() => ({
            ...userData,
            username: event.target.value,
        }))
    };

    const handleEmailChange = (event) => {
        setUserData(() => ({
            ...userData,
            email: event.target.value,
        }))
    };

    const handleRightsChange = (event) => {
        setUserData(() => ({
            ...userData,
            isAdmin: event.target.value === "admin",
        }));
    };

    const handleBioChange = (event) => {
        setUserData(() => ({
            ...userData,
            bio: event.target.value,
        }))
    };

    const handleProfilePictureChange = async (event) => {
        const file = event.target.files[0];
        const maxSize = 1 * 1024 * 1024; // 1MB

        if (file) {
            if (!file.type.startsWith('image/')) {
                setUserData(() => ({
                    ...userData,
                    profilePicture: '',
                }))
                toast.error('Please upload an image file.');
                return;
            }
            if (file.size > maxSize) {
                setUserData(() => ({
                    ...userData,
                    profilePicture: '',
                }))
                setProfilePicture();
                toast.error('File size exceeds 1MB.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => setUserData(() => ({
                ...userData,
                profilePicture: reader.result,
            }));
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/update`,
                userData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true // if you need to send cookies with the request
                }
            );

            if (response.status === 200) {
                navigate('/AdminPanel/Users');
                toast.success('Profile updated successfully!');
            } else {
                toast.error('Failed to update profile.');
            }
        } catch (error) {
            toast.error(`Error: ${error.response.data.message}`);
        }
    };

    return (
        <div className="flex-grow bg-black p-6 text-green-400">
            <div className="max-w-md mx-auto bg-gray-900 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Profile</h2>
                {loading ? (<Spinner />) : (
                    <>
                        <div className="mb-4">
                            <label htmlFor="profilePicture" className="block text-sm font-medium mb-1">Profile Picture (you can use <a href="https://getavataaars.com" className='underline'>getavataaars</a> to generate one)</label>

                            <div className='flex flex-row items-center'>
                                <div className="basis-1/4">
                                    <img src={userData.profilePicture} alt={userData.username} height={64} width={64} className="mx-auto" />
                                </div>
                                <div className='basis-3/4'>
                                    <input
                                        id="profilePicture"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                        className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 bg-gray-900 text-white"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={userData.username}
                                onChange={handleUsernameChange}
                                className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-900 text-white"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={userData.email}
                                onChange={handleEmailChange}
                                className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-900 text-white"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="bio" className="block text-sm font-medium mb-1">Bio</label>
                            <textarea
                                id="bio"
                                value={userData.bio}
                                onChange={handleBioChange}
                                className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-900 text-white"
                                rows="4"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="userRights" className="block text-sm font-medium mb-1">User Rights</label>
                            <select
                                id="userRights"
                                value={userData.isAdmin ? "admin" : "regular"}
                                onChange={handleRightsChange}
                                className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-900 text-white"
                            >
                                <option value="regular">Regular users rights</option>
                                <option value="admin">Administrator rights</option>
                            </select>
                        </div>
                    </>
                )}
                <button
                    onClick={handleSave}
                    className="w-full bg-green-600 text-white mt-3 py-2 px-4 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    Save
                </button>
            </div>
        </div>
    )
}

export default UserEdit