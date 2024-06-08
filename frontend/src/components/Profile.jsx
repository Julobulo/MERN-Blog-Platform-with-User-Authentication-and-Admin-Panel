import React from "react";
import { Link } from "react-router-dom";
import AuthorCard from "./AuthorCard";

// Sample data for testing
const authorData = {
    imgSrc: 'via.placeholder.com/64',
    username: 'john_doe',
    date: 'January 1, 2020',
    bio: 'I am a tech enthusiast and a blogger. I write about AI, machine learning, and data science.'
};

const Profile = () => {
    return (

        <div className="min-h-screen bg-black p-6 text-white">
            <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Profile</h2>
                <AuthorCard
                    imgSrc={authorData.imgSrc}
                    username={authorData.username}
                    date={authorData.date}
                    bio={authorData.bio}
                    isAdmin={true}
                />
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