import React, { useState } from "react";
import AuthorCard from "../AuthorCard";

const user = {
    imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYmkp9a2rrD1Sskb9HLt5mDaTt4QaIs8CcBg&s",
    username: "john_doe",
    date: 'January 1, 2020',
    bio: "I am a tech enthusiast and a blogger.",
    email: "john@example.com",
    isAdmin: true,
};

const UserDelete = () => {
    const [isDeleted, setIsDeleted] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        try {
            // Mock delete operation
            await axios.delete('http://localhost:5555/blog/delete', { data: { _id: user._id } });
            setIsDeleted(true);
        } catch (error) {
            setError('Failed to delete the user.');
        }
    };

    const confirmDelete = () => {
        setIsConfirming(true);
    };

    const cancelDelete = () => {
        setIsConfirming(false);
    };

    if (isDeleted) {
        return (
            <div className="min-h-screen bg-black p-6 text-green-400">
                <div className="my-5 max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md text-center">
                    <h1 className="text-2xl font-bold mb-6">User Deleted</h1>
                    <p>The user has been successfully deleted.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black p-6 text-green-400">
            <div className="my-5 max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Delete User</h1>
                <AuthorCard
                    imgSrc={user.imgSrc}
                    username={user.username}
                    date={user.date}
                    bio={user.bio}
                    email={user.email}
                    isAdmin={user.isAdmin}
                />
                <div className="mt-5 text-center">
                    {isConfirming ? (
                        <div className="text-center">
                            <p className="mb-4">Are you sure you want to delete this user?</p>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mr-4"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="bg-gray-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={confirmDelete}
                            className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Delete User
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserDelete