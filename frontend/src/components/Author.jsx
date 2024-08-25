import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify';
import ArticleCard from './ArticleCard';
import AuthorCard from './AuthorCard';
import Spinner from "./Spinner";

const Author = () => {
    const { author } = useParams();
    useEffect(() => {
        document.title = `Author - ${author}`;
    }, [author]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [authorData, setAuthorData] = useState({});
    const [authorArticles, setAuthorArticles] = useState([]);

    useEffect(() => {
        setLoading(true);
        axios.get(
            `http://localhost:5555/user/${author}`,
            { withCredentials: true } // not needed as we don't need to authenticate
        )
            .then((response) => {
                setLoading(false);
                // const { _id, email, username, isAdmin, profilePicture } = response.data;
                setAuthorData(response.data);
            })
            .catch((error) => {
                setLoading(false);
                setError(true);
                console.log(error.response.data.message);
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
            }
            )
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:5555/blog/author/${author}`,
            { withCredentials: true }
        )
            .then((response) => {
                setAuthorArticles(response.data);
            })
            .catch((error) => {
                console.log(error.response.data.message);
            })
    }, []);

    if (loading) {
        return (
            <div className='flex-grow bg-black p-6 text-green-400'>
                <div className="my-5 max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md">
                    <Spinner />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='flex-grow bg-black p-6 text-green-400'>
                <div className="my-5 max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md text-center">
                    <span className='text-red-400'>There was an error retrieving data</span>
                </div>
            </div>
        )
    }

    return (
        <div className='flex-grow bg-black p-6 text-green-400'>
            <div className="my-5 max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md">
                <AuthorCard
                    imgSrc={authorData.profilePicture}
                    username={authorData.username}
                    date={authorData.date}
                    bio={authorData.bio}
                    isAdmin={authorData.isAdmin}
                    isSuperAdmin={authorData.isSuperAdmin}
                />
                {authorArticles.length > 0 ? (
                    <>
                        <hr className='mt-6' />
                        <h1 className="text-2xl font-bold mt-7 mb-1">By {authorData.username}:</h1>
                        <div className="grid grid-cols-1 gap-4">
                            {authorArticles.map((article, index) => (
                                <ArticleCard
                                    key={index}
                                    title={article.title}
                                    title_highlighted={article.title_highlighted}
                                    subtitle={article.subtitle}
                                    author={article.author_name}
                                    author_highlighted={article.author_highlighted}
                                    author_profilePicture={article.author_profilePicture}
                                    date={article.date}
                                    tags={article.tags}
                                    imgSrc={article.image}
                                    likes={article.likes}
                                    liked={article.liked}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center mt-6">
                        <span className='text-red-400'>No articles by {authorData.username} were found</span>
                    </div>
                )}
            </div>
        </div>
    );
};


export default Author
