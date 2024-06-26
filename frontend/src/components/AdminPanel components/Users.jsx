import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import AuthorCard from '../AuthorCard';
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri" ;
import Spinner from '../Spinner';
import { toast } from 'react-toastify';

// // Sample data for testing
// const users = [
//     {
//         _id: 1,
//         username: "john_doe",
//         email: "john@example.com",
//         bio: "I love peanuts",
//         imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYmkp9a2rrD1Sskb9HLt5mDaTt4QaIs8CcBg&s",
//         date: "January 1, 2020",
//         isAdmin: false,
//     },
//     {
//         _id: 2,
//         username: "jane_smith",
//         email: "jane@example.com",
//         bio: "I'm a passionate critic and skeptic who always looks at things from a unique perspective. My friends often call me a 'hater,' but I prefer to think of myself as someone who values honesty and critical thinking above all else. I believe that questioning the status quo and challenging popular opinions are essential for progress and innovation. Whether it's a new tech trend, a popular movie, or the latest fashion craze, I enjoy diving deep into the details and exploring different viewpoints.",
//         imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYmkp9a2rrD1Sskb9HLt5mDaTt4QaIs8CcBg&s",
//         date: "February 15, 2020",
//         isAdmin: true,
//     },
//     // Add more users as needed...
// ];

const Users = () => {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [users, setUsers] = useState([]);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true); // are there more users?
    const limit = 2; // Number of users per request

    const fetchUsers = (skip, search) => {
        if (skip > 0) { setLoadingMore(true) } else { setLoading(true); setUsers([]) }
        axios.get(
            `http://localhost:5555/user/adminpanel?skip=${skip}&search=${search}`,
            { withCredentials: true }
        )
            .then((response) => {
                if (response.data.length > 0) {
                    setSkip(skip + limit)
                    if (skip < 1) {
                        // if skip < 1 then we have to erase everything in the array before
                        setUsers([])
                    }
                    setUsers(users => (users ? users.concat(response.data) : response.data));
                    if (response.data.length < limit) {
                        setHasMore(false);
                    }
                } else {
                    setHasMore(false);
                }
                setLoading(false);
                setLoadingMore(false);
            })
            .catch((error) => {
                setLoading(false);
                setLoadingMore(false);
                console.log(error);
                // Sample data for testing
                setUsers([{
                    imgSrc: 'https://via.placeholder.com/64',
                    username: 'username',
                    date: 'January 1, 2000',
                    bio: 'bio',
                    email: 'email',
                    isAdmin: false,
                }]);
                // toast.error(`Couldn't fetch the data... Error: ${error.response.data.message}`);
            })
    }

    useEffect(() => {
        fetchUsers(skip, '')
    }, []);

    // const filteredUsers = users.filter(user =>
    //     user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     user.bio.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    return (
        <div className='flex-grow bg-black'>
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
                        onChange={e => {
                            setSearchQuery(e.target.value);
                            setSkip(0);
                            setHasMore(true);
                            fetchUsers(0, e.target.value);
                        }}
                        className="mb-4 px-4 py-2 rounded-lg w-full text-black dark:text-white"
                    />
                    <div className=" w-full">
                        {loading ? (
                            <div className='mb-5'>
                                <Spinner />
                            </div>
                        ) : (
                            users && (
                            users.map(user => (
                                <div className='flex flex-row'>
                                    <div className='basis-11/12 m-5'>
                                        <AuthorCard
                                            imgSrc={user.profilePicture}
                                            username={user.username}
                                            date={user.createdAt}
                                            bio={user.bio}
                                            email={user.email}
                                            isAdmin={user.isAdmin}
                                            isSuperAdmin={user.isSuperAdmin}
                                        />
                                    </div>
                                    <div className="basis-1/12 flex flex-col justify-evenly items-center">
                                        <Link to={`/AdminPanel/Users/Edit/${user.username}`} className='text-yellow-400 '>
                                            <FiEdit2 />
                                        </Link>
                                        <Link to={`/AdminPanel/Users/Password/${user.username}`} className='text-blue-400 '>
                                            <RiLockPasswordLine />
                                        </Link>
                                        <Link to={`/AdminPanel/Users/Delete/${user.username}`} className='text-red-400'>
                                            <MdDeleteOutline />
                                        </Link>
                                    </div>
                                </div>
                            )) )
                        )}
                        {loadingMore ? (<Spinner />) : (
                            hasMore && (
                                <button
                                    onClick={() => fetchUsers(skip, searchQuery)}
                                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Load More
                                </button>
                            )
                        )
                        }
                        {!hasMore && <p className='text-center'>No more users to load</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Users;
