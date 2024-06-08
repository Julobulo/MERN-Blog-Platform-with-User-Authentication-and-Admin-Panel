import React, { useState } from "react";

const UserEdit = () => {
    // Example user data
    const userData = {
        username: "john_doe",
        email: "john@example.com",
        bio: "I am a tech enthusiast and a blogger.",
        isAdmin: true,
    };

    const [username, setUsername] = useState(userData.username);
    const [email, setEmail] = useState(userData.email);
    const [bio, setBio] = useState(userData.bio);
    const [isAdmin, setIsAdmin] = useState(userData.isAdmin);
    const [message, setMessage] = useState("");

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleBioChange = (event) => {
        setBio(event.target.value);
    };

    const handleAdminChange = (event) => {
        setIsAdmin(event.target.value === "admin");
    };

    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:5555/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, bio })
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
        <div className="min-h-screen bg-black p-6 text-green-400">
            <div className="max-w-md mx-auto bg-gray-900 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Profile</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-900 text-white"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-900 text-white"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="bio" className="block text-sm font-medium mb-1">Bio</label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={handleBioChange}
                        className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-900 text-white"
                        rows="4"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="userRights" className="block text-sm font-medium mb-1">User Rights</label>
                    <select
                        id="userRights"
                        value={isAdmin ? "admin" : "regular"}
                        onChange={handleAdminChange}
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
    )
}

export default UserEdit