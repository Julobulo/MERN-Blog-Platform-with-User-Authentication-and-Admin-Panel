import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ProfileEdit = () => {
    // Example user data
    const userData = {
        profilePicture: "https://via.placeholder.com/150", // Default profile picture
        username: "john_doe",
        email: "john@example.com",
        bio: "I am a tech enthusiast and a blogger.",
        isAdmin: false,
    };

    const [bio, setBio] = useState(userData.bio);
    const [message, setMessage] = useState("");
    const [profilePicture, setProfilePicture] = useState(userData.profilePicture); // State for profile picture

    const handleBioChange = (event) => {
        setBio(event.target.value);
    };

    const handleProfilePictureChange = (event) => {
        const file = event.target.files[0];
        const maxSize = 1 * 1024 * 1024; // 1MB

        if (file) {
            if (!file.type.startsWith('image/')) {
                setProfilePicture();
                toast.error('Please upload an image file.');
                return;
            }
            if (file.size > maxSize) {
                setProfilePicture();
                toast.error('File size exceeds 1MB.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => setProfilePicture(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:5555/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bio,  })
            });

            if (response.ok) {
                setMessage("Profile updated successfully.");
                toast.success('Profile updated successfully!');
            } else {
                setMessage("Failed to update profile.");
                toast.error('Failed to update profile.');
            }
        } catch (error) {
            setMessage("Error: " + error.message);
            toast.error(`Error: ${error}`);
        }
    };

    return (
        <div className="min-h-screen bg-black p-6 text-green-400">
            <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
                <div className="mb-4">
                    <label htmlFor="profilePicture" className="block text-sm font-medium mb-1">Profile Picture (use getavataaars.com to generate one)</label>
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
                        value={bio}
                        onChange={handleBioChange}
                        className="min-h-10 w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-900 text-white"
                        rows="4"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="userRights" className="block text-sm font-medium mb-1">User Rights</label>
                    <select
                        disabled
                        id="userRights"
                        value={userData.isAdmin ? "admin" : "regular"}
                        className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-900 text-white"
                    >
                        <option value="regular">Regular users rights</option>
                        <option value="admin">Administrator rights</option>
                    </select>
                </div>
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
