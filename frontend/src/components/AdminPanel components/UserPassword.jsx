import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../Spinner";
import axios from "axios";
import AuthorCard from "../AuthorCard";

const UserPassword = () => {
    const { author } = useParams();
    // To be able to navigate to other pages
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [isChanged, setIsChanged] = useState(false);
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

    const handleChange = async () => {
        try {
            const response = await axios.put(`http://localhost:5555/user/password`,
                {
                    data: userData,
                    withCredentials: true
                }
            );
            toast.success(response.data.message);
            setIsChanged(true);
            navigate('/AdminPanel/Users');
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const confirmChange = () => {
        setIsConfirming(true);
    };

    const cancelChange = () => {
        setIsConfirming(false);
    };

    if (isChanged) {
        return (
            <div className="min-h-screen bg-black p-6 text-green-400">
                <div className="my-5 max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md text-center">
                    <h1 className="text-2xl font-bold mb-6">Password changed</h1>
                    <p>The password has been changed.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black p-6 text-green-400">
            <div className="my-5 max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Change User Password</h1>
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
                                    <p className="mb-4">Are you sure you want to change this user's password?</p>
                                    <button
                                        onClick={handleChange}
                                        className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mr-4"
                                    >
                                        Yes, Change
                                    </button>
                                    <button
                                        onClick={cancelChange}
                                        className="bg-gray-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={confirmChange}
                                    className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Change Password
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default UserPassword