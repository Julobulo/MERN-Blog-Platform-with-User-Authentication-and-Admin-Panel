import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import AuthorCard from "./AuthorCard";
import Spinner from "./Spinner";
import Cookies from "js-cookie";


const Profile = () => {
    useEffect(() => {
        document.title = `Profile`;
    }, []);
    const navigate = useNavigate();
    useEffect(() => {
        if (!Cookies.get('token')) {
            navigate('/login')
        }}, [navigate])
    const [loading, setLoading] = useState(true);
    const [authorData, setAuthorData] = useState(null);
    useEffect(() => {
        setLoading(true);
        axios.get(
            `http://localhost:5555/user/`,
            { withCredentials: true }
        )
            .then((response) => {
                setLoading(false);
                // const { _id, email, username, isAdmin, profilePicture } = response.data;
                setAuthorData(response.data);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
                // Sample data for testing
                setAuthorData({
                    imgSrc: 'https://via.placeholder.com/64',
                    username: 'username',
                    date: 'January 1, 2000',
                    bio: 'bio',
                    email: 'email',
                    isAdmin: false,
                });
                toast.error(error.response.data.message);
                navigate('/login');
            }
            )
    }, []);
    return (
        <div className="flex-grow bg-black p-6 text-white">
            <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Profile</h2>
                {loading ? (<Spinner />) : (
                    <AuthorCard
                        imgSrc={authorData.profilePicture}
                        username={authorData.username}
                        date={authorData.date}
                        bio={authorData.bio}
                        email={authorData.email}
                        isAdmin={authorData.isAdmin}
                        isSuperAdmin={authorData.isSuperAdmin}
                    />)}
                <div className="text-center mt-5">
                    <Link to={'/profile/edit'}>
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Edit Profile
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Profile