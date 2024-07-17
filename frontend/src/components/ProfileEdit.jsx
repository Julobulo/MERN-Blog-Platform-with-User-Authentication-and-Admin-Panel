import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from './Spinner';

const ProfileEdit = () => {
    // To be able to navigate to other pages
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get(
            `http://localhost:5555/user/`,
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
                }));
                event.target.value = '';
                toast.error('Please upload an image file.');
                return;
            }
            if (file.size > maxSize) {
                setUserData(() => ({
                    ...userData,
                    profilePicture: '',
                }));
                event.target.value = '';
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

    const handleRightsChange = () => {
        setUserData(() => ({
            ...userData,
            isAdmin: event.target.value === "admin",
        }))
    }

    const handleSave = async () => {
        try {
            const response = await axios.post('http://localhost:5555/user/update',
                userData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true // if you need to send cookies with the request
                }
            );

            navigate('/profile');
            toast.success(response.data.message);
        } catch (error) {
            toast.error(`Error: ${error.response.data.message}`);
        }
    };

    return (
        <div className="flex-grow bg-black p-6 text-green-400">
            <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
                {loading ? (
                    <div className='mb-5'>
                        <Spinner />
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            <label htmlFor="profilePicture" className="block text-sm font-medium mb-1">Profile Picture (you can use <a href="https://getavataaars.com" className='underline' target="_blank" rel="noopener noreferrer">getavataaars</a> to generate one)</label>
                            <input
                                id="profilePicture"
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePictureChange}
                                className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 bg-gray-900 text-white"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Username</label>
                            <p className="bg-gray-900 p-2 rounded-md text-white">{userData.username}</p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <p className="bg-gray-900 p-2 rounded-md text-white">{userData.email}</p>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="bio" className="block text-sm font-medium mb-1">Bio</label>
                            <textarea
                                id="bio"
                                minLength={10}
                                maxLength={1000}
                                value={userData.bio}
                                onChange={handleBioChange}
                                className="min-h-10 w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-900 text-white"
                                rows="4"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="userRights" className="block text-sm font-medium mb-1">User Rights (in a production site, this field would be disabled. However, for demonstration purposes, it is enabled in both the frontend and the backend)</label>
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
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default ProfileEdit;
