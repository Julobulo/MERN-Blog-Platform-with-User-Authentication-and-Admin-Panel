import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ArticleCard from '../ArticleCard';
import AuthorCard from '../AuthorCard';
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";

// Sample data for testing
const users = [
    {
        _id: 1,
        username: "john_doe",
        email: "john@example.com",
        bio: "I love peanuts",
        imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYmkp9a2rrD1Sskb9HLt5mDaTt4QaIs8CcBg&s",
        date: "January 1, 2020",
        isAdmin: false,
    },
    {
        _id: 2,
        username: "jane_smith",
        email: "jane@example.com",
        bio: "I'm a passionate critic and skeptic who always looks at things from a unique perspective. My friends often call me a 'hater,' but I prefer to think of myself as someone who values honesty and critical thinking above all else. I believe that questioning the status quo and challenging popular opinions are essential for progress and innovation. Whether it's a new tech trend, a popular movie, or the latest fashion craze, I enjoy diving deep into the details and exploring different viewpoints.",
        imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYmkp9a2rrD1Sskb9HLt5mDaTt4QaIs8CcBg&s",
        date: "February 15, 2020",
        isAdmin: true,
    },
    // Add more users as needed...
];

const UserCard = ({ _id, username, email, date, bio, profilePicture, isAdmin }) => {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 flex flex-row">
            <div className="flex items-center mb-4 basis-1/2">
                <a href={`/author/${_id}`}>
                    <img
                        alt={username}
                        src={profilePicture}
                        className="w-16 h-16 rounded-full mr-4"
                    />
                </a>
                <div>
                    <h2 className="text-2xl font-bold">{username}</h2>
                    <p className="text-sm text-gray-400">Email: {email}</p>
                    <p className="text-sm text-gray-400">Joined: {date}</p>
                    <p className={`text-sm text-${isAdmin ? 'green' : 'red'}-400`}>User is {isAdmin ? '' : 'not'} an administrator</p>
                </div>
            </div>
            <hr />
            <p className="text-gray-300 basis-1/2 mx-auto">{bio}</p>
        </div>
    );
}

const Users = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.bio.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='bg-black text-white'>
            <div className='container mx-auto px-4 py-8'>
                <div className="p-6 mb-8 bg-gray-900 rounded-xl shadow-md text-green-400 flex flex-col items-center max-w-3xl mx-auto">
                    <div className="flex justify-center space-x-6 mb-4 bg-gray-900 p-4 rounded-lg">
                        <Link to="/AdminPanel/Articles"
                            className={`text-lg font-semibold ${location.pathname === '/AdminPanel/Articles' ? 'text-yellow-400' : 'text-white'} hover:text-yellow-400`}>
                            Articles
                        </Link>
                        <Link to="/AdminPanel/Users"
                            className={`text-lg font-semibold ${location.pathname === '/AdminPanel/Users' ? 'text-yellow-400' : 'text-white'} hover:text-yellow-400`}>
                            Users
                        </Link>
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="mb-4 px-4 py-2 rounded-lg text-black w-full"
                    />
                    <div className=" w-full">
                        {filteredUsers.map(user => (
                            <div className='flex flex-row'>
                                <div className='basis-11/12 m-5'>
                                    {/* <UserCard
                                        key={user._id}
                                        _id={user._id}
                                        username={user.username}
                                        email={user.email}
                                        bio={user.bio}
                                        profilePicture={user.profilePicture}
                                        date={user.date}
                                        isAdmin={user.isAdmin}
                                    /> */}
                                    <AuthorCard
                                        imgSrc={user.imgSrc}
                                        username={user.username}
                                        date={user.date}
                                        bio={user.bio}
                                        isAdmin={user.isAdmin}
                                    />
                                </div>
                                <div className="basis-1/12 flex flex-col justify-evenly items-center">
                                    <Link to={`/AdminPanel/Users/Edit/${user._id}`} className='text-yellow-400 '>
                                        <FiEdit2 />
                                    </Link>
                                    <Link to={`/AdminPanel/Users/Delete/${user._id}`} className='text-red-400'>
                                        <MdDeleteOutline />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Users;
