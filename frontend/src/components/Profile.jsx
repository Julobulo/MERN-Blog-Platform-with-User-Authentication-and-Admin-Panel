import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Profile = () => {
    // Example user data
    const userData = {
        username: "john_doe",
        email: "john@example.com",
        bio: "I am a tech enthusiast and a blogger.",
        isAdmin: true,
    };

    const [bio, setBio] = useState(userData.bio);
    const [message, setMessage] = useState("");

    const handleBioChange = (event) => {
        setBio(event.target.value);
    };

    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:5555/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bio })
            });

            if (response.ok) {
                setMessage("Bio updated successfully.");
                toast.success('Bio updated successfully!');
            } else {
                setMessage("Failed to update bio.");
                toast.error('Failed to update bio.');
            }
        } catch (error) {
            setMessage("Error: " + error.message);
            toast.error(`Error: ${error}`);
        }
    };

    return (
        <div className="min-h-screen bg-black p-6 text-white">
            <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Profile</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <p className="bg-gray-900 p-2 rounded-md">{userData.username}</p>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <p className="bg-gray-900 p-2 rounded-md">{userData.email}</p>
                </div>
                <div className="mb-4">
                    <label htmlFor="bio" className="block text-sm font-medium mb-1">Bio</label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={handleBioChange}
                        className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-900 text-white"
                        rows="4"
                    />
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

export default Profile;
