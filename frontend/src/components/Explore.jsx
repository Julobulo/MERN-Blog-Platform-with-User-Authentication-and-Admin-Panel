import React, { useState, useEffect } from 'react';
import axios from "axios";
import { toast } from 'react-toastify';
import ArticleCard from './ArticleCard';
import Spinner from './Spinner';
import SkeletonLoader from './SkeletonLoader';

const App = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const limit = 4;

    const fetchArticles = (skip, search) => {
        if (skip > 0) {
            setLoadingMore(true);
        } else {
            setLoading(true);
            setArticles([]);
        }
        axios.get(
            `http://localhost:5555/blog/articles?skip=${skip}&search=${search}`,
            { withCredentials: true }
        )
            .then((response) => {
                if (response.data.length > 0 && response.data.length === limit) {
                    setSkip(skip + limit);
                    if (skip < 1) {
                        setArticles(response.data);
                    } else {
                        setArticles([...articles, ...response.data]);
                    }
                }
                else if (response.data.length > 0 && response.data.length < limit) {
                    setSkip(skip + limit);
                    if (skip < 1) {
                        setArticles(response.data);
                    } else {
                        setArticles([...articles, ...response.data]);
                    }
                    setHasMore(false);
                }
                else {
                    setHasMore(false);
                }
                setLoading(false);
                setLoadingMore(false);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
                setLoading(false);
                setLoadingMore(false);
            });
    }

    useEffect(() => {
        fetchArticles(skip, '');
    }, [])

    return (
        <div className="flex-grow bg-black md:p-6 p-0">
            <div className="md:p-6 p-2">
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={
                            e => {
                                setSearchQuery(e.target.value);
                                setSkip(0);
                                setHasMore(true);
                                fetchArticles(0, e.target.value);
                            }
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <SkeletonLoader key={index} />
                        ))
                    ) : (articles.map((article, index) => (
                        <ArticleCard
                            key={index}
                            title={article.title}
                            subtitle={article.subtitle}
                            author={article.author}
                            date={article.date}
                            tags={article.tags}
                            imgSrc={article.image}
                            likes={article.likes}
                            liked={article.liked}
                        />
                    )))
                    }
                </div>
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
    );
}

export default App;