import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthorCard from "../AuthorCard";
import Spinner from "../Spinner";
import { toast } from "react-toastify";

// const user = {
//     imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYmkp9a2rrD1Sskb9HLt5mDaTt4QaIs8CcBg&s",
//     username: "john_doe",
//     date: 'January 1, 2020',
//     bio: "I am a tech enthusiast and a blogger.",
//     email: "john@example.com",
//     isAdmin: true,
// };

const UserDelete = () => {
    const { author } = useParams();
    // To be able to navigate to other pages
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get(
            `http://localhost:5555/user/${author}`,
            { withCredentials: true }
        )
            .then((response) => {
                setLoading(false);
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
                setIsDeleted(true);
                toast.error(error.response.data.message);
            }
            )
    }, [setUserData]);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:5555/user/delete`,
                {
                    data: userData,
                    withCredentials: true
                }
            );
            toast.success(response.data.message);
            setIsDeleted(true);
            navigate('/AdminPanel/Users');
        } catch (error) {
            toast.error(error.response.data.message);
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
                    <p>This user has been deleted.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black p-6 text-green-400">
            <div className="my-5 max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Delete User</h1>
                {loading ? (<Spinner />) : (
                    <>
                        <AuthorCard
                            imgSrc={userData.profilePicture}
                            username={userData.username}
                            date={userData.date}
                            bio={userData.bio}
                            email={userData.email}
                            isAdmin={userData.isAdmin}
                            isSuperAdmin={userData.isSuperAdmin}
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
                    </>
                )}
            </div>
        </div>
    )
}

export default UserDelete