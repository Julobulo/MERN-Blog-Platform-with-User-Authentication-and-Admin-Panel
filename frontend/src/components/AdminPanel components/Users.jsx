import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthorCard from '../AuthorCard';
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri";
import Spinner from '../Spinner';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";

const Users = () => {
    useEffect(() => {
        document.title = `AdminPanel - Users`;
    }, []);
    const navigate = useNavigate();
    useEffect(() => {
        if (!Cookies.get('token')) {
            navigate('/login');
        }
    }, []);
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [users, setUsers] = useState([]);
    const [highlightedUsers, setHighlightedUsers] = useState([]);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true); // are there more users?
    const [wasHighlighted, setWasHighlighted] = useState(false);
    const limit = 2; // Number of users per request

    useEffect(() => {
        if (!users.length || wasHighlighted) {
            return
        }

        let updatedUsers = users;
        if (searchQuery) {
            // Create a regular expression with the search query (case-insensitive)
            const regex = new RegExp(searchQuery, 'ig');
            
            // Update the users array with highlighted fields
            updatedUsers = users.map((user) => {
                return {
                    ...user,
                    username_highlighted: user.username.replace(regex, (match) => `<span class="bg-green-300">${match}</span>`),
                    bio: user.bio.replace(regex, (match) => `<span class="bg-green-500">${match}</span>`),
                    email: user.email.replace(regex, (match) => `<span class="bg-green-300">${match}</span>`),
                };
            });
        }

        // Set the updated users
        setHighlightedUsers(updatedUsers);
        setWasHighlighted(true);
    }, [users]);

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
                setWasHighlighted(false);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
                if (error.response.status === 401) {
                    navigate('/login');
                }
                console.log(error);
            })
    }

    useEffect(() => {
        fetchUsers(skip, '')
    }, []);

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
                            highlightedUsers && (
                                highlightedUsers.map(user => (
                                    <div className='flex flex-row'>
                                        <div className='basis-11/12 m-5'>
                                            <AuthorCard
                                                imgSrc={user.profilePicture}
                                                username={user.username}
                                                username_highlighted={user.username_highlighted}
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
                                )))
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
