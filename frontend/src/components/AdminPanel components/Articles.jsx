import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ArticleCard from '../ArticleCard';
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import Cookies from "js-cookie";

// Sample data for testing
const posts = [
    {
        _id: 1,
        title: "The Rise of Artificial Intelligence in Modern Society",
        subtitle: "Explore how AI is transforming the healthcare industry.",
        author: "John Doe",
        tags: ["AI", "Healthcare"],
        likes: 120,
        imgSrc: "https://via.placeholder.com/400x200",
        date: "2023-06-01",
        description: "This article explores the rise of AI in modern society, focusing on its impact on the healthcare industry."
    },
    {
        _id: 2,
        title: "AI and Financial Services",
        subtitle: "Discover the ways AI is revolutionizing the financial sector.",
        author: "Jane Smith",
        tags: ["AI", "Finance"],
        likes: 98,
        imgSrc: "https://via.placeholder.com/400x200",
        date: "2023-06-02",
        description: "This article discusses how AI is transforming the financial sector, improving efficiency and reducing costs."
    },
    // Add more posts as needed...
];

const Articles = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!Cookies.get('token')) {
            navigate('/login');
        }
    }, []);
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return (
        <div className='flex-grow bg-black text-white'>
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
                        className="mb-4 px-4 py-2 rounded-lg w-full text-black dark:text-white"
                    />
                    <div className=" w-full">
                        {filteredPosts.map(post => (
                            <div className='flex flex-row'>
                                <div className='basis-11/12'>
                                    <ArticleCard
                                        key={post._id}
                                        title={post.title}
                                        description={post.description}
                                        href={`/blog/article/${post._id}`}
                                        author={post.author}
                                        date={post.date}
                                        tags={post.tags}
                                        imgSrc={post.imgSrc}
                                        hearts={post.likes}
                                    />
                                </div>
                                <div className="basis-1/12 flex flex-col justify-evenly items-center">
                                    <Link to={`/AdminPanel/Articles/Edit/${post._id}`} className='text-yellow-400 '>
                                        <FiEdit2 />
                                    </Link>
                                    <Link to={`/AdminPanel/Articles/Delete/${post._id}`} className='text-red-400'>
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

export default Articles;
