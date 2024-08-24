import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ArticleCard from '../ArticleCard';
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import Cookies from "js-cookie";
import axios from 'axios';
import Spinner from '../Spinner';
import { toast } from 'react-toastify';

const Articles = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!Cookies.get('token')) {
            navigate('/login');
        }
    }, []);
    const [searchQuery, setSearchQuery] = useState("");
    const [articles, setArticles] = useState([]);
    const [highlightedArticles, setHighlightedArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [skip, setSkip] = useState(0);
    const [wasHighlighted, setWasHighlighted] = useState(false);
    const location = useLocation();
    const limit = 2;

    useEffect(() => {
        if (!articles.length || wasHighlighted) {
            return
        }
        let updatedArticles = articles;
        if (searchQuery) {
            // Create a regular expression with the search query (case-insensitive)
            const regex = new RegExp(searchQuery, 'ig');
            // Update the users array with highlighted fields
            updatedArticles = articles.map((article) => {
                return {
                    ...article,
                    title_highlighted: article.title.replace(regex, (match) => `<span class="bg-green-300">${match}</span>`),
                    subtitle: article.subtitle.replace(regex, (match) => `<span class="bg-green-300">${match}</span>`),
                    author_highlighted: article.author_name.replace(regex, (match) => `<span class="bg-green-500">${match}</span>`),
                    tags: article.tags.map(tag => tag.replace(regex, (match) => `<span class="bg-green-300">${match}</span>`)),
                };
            });
        }

        // Set the updated users
        setHighlightedArticles(updatedArticles);
        setWasHighlighted(true);
    }, [articles]);

    const fetchArticles = (skip, search) => {
        if (skip > 0) { setLoadingMore(true) } else { setLoading(true); setArticles([]) }
        axios.get(
            `http://localhost:5555/blog/adminpanel?skip=${skip}&search=${search}`,
            { withCredentials: true }
        )
            .then((response) => {
                if (response.data.length > 0) {
                    setSkip(skip + limit)
                    if (skip < 1) { // if skip < 1 then we have to erase everything in the array before
                        setArticles([])
                    }
                    setArticles(articles => (articles ? articles.concat(response.data) : response.data));
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
                if (error.response.status === 401) {
                    toast.error(error.response.data.message);
                    navigate('/login');
                }
                setLoading(false);
                setLoadingMore(false);
                console.log(error);
                // Sample data for testing
                setArticles([{
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
        fetchArticles(skip, '')
    }, []);

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
                        onChange={e => {
                            setSearchQuery(e.target.value);
                            setSkip(0);
                            setHasMore(true);
                            fetchArticles(0, e.target.value);
                        }}
                        className="mb-4 px-4 py-2 rounded-lg w-full text-black dark:text-white"
                    />
                    <div className=" w-full">
                        {loading ? (
                            <div className='mb-5'>
                                <Spinner />
                            </div>
                        ) : (highlightedArticles.map(article => (
                            <div className='flex flex-row'>
                                <div className='basis-11/12'>
                                    <ArticleCard
                                        key={article._id}
                                        title={article.title}
                                        title_highlighted={article.title_highlighted}
                                        subtitle={article.subtitle}
                                        href={`/blog/article/${article.title}`}
                                        author={article.author_name}
                                        author_highlighted={article.author_highlighted}
                                        author_profilePicture={article.author_profilePicture}
                                        date={article.date}
                                        tags={article.tags}
                                        imgSrc={article.image}
                                        likes={article.likes}
                                    />
                                </div>
                                <div className="basis-1/12 flex flex-col justify-evenly items-center">
                                    <Link to={`/AdminPanel/Articles/Edit/${article.title}`} className='text-yellow-400 '>
                                        <FiEdit2 />
                                    </Link>
                                    <Link to={`/AdminPanel/Articles/Delete/${article.title}`} className='text-red-400'>
                                        <MdDeleteOutline />
                                    </Link>
                                </div>
                            </div>)
                        ))}
                        {loadingMore ? (<Spinner />) : (
                            hasMore && (
                                <button
                                    onClick={() => fetchArticles(skip, searchQuery)}
                                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Load More
                                </button>
                            )
                        )
                        }
                        {!hasMore && <p className='text-center'>No more articles to load</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Articles;
