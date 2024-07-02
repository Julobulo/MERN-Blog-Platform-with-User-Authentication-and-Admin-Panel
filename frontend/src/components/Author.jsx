import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify';
import ArticleCard from './ArticleCard';
import AuthorCard from './AuthorCard';
import Spinner from "./Spinner";

const authorArticles = [
    {
        title: "The Rise of Artificial Intelligence in Modern Society",
        description: "Explore how AI is transforming the healthcare industry, from diagnostics to treatment.",
        href: "#",
        author: "john_doe",
        date: "June 1, 2024",
        tags: ["AI", "Healthcare"],
        imgSrc: "https://via.placeholder.com/300",
        hearts: 120
    },
    {
        title: "AI and Financial Services",
        description: "Discover the ways AI is revolutionizing the financial sector and enhancing security.",
        href: "#",
        author: "john_doe",
        date: "May 20, 2024",
        tags: ["AI", "Finance"],
        imgSrc: "https://via.placeholder.com/300",
        hearts: 98
    },
    {
        title: "The Impact of Machine Learning on Big Data",
        description: "An in-depth look at how machine learning algorithms are used to analyze and interpret big data.",
        href: "#",
        author: "john_doe",
        date: "April 15, 2024",
        tags: ["Machine Learning", "Big Data"],
        imgSrc: "https://via.placeholder.com/300",
        hearts: 85
    }
];

const Author = () => {
    const { author } = useParams(); // gets the author from the url
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [authorData, setAuthorData] = useState({
        imgSrc: 'https://via.placeholder.com/64',
        username: 'john_doe',
        date: 'January 1, 2020',
        bio: 'I am a tech enthusiast and a blogger. I write about AI, machine learning, and data science.',
    });

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
                {authorArticles.length > 0 && (
                    <>
                        <hr className='mt-6' />
                        <h1 className="text-2xl font-bold mt-7 mb-1">By {authorData.username}:</h1>
                        <div className="grid grid-cols-1 gap-4">
                            {authorArticles.map((article, index) => (
                                <ArticleCard
                                    key={index}
                                    title={article.title}
                                    description={article.description}
                                    href={article.href}
                                    author={article.author}
                                    date={article.date}
                                    tags={article.tags}
                                    imgSrc={article.imgSrc}
                                    hearts={article.hearts}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};


export default Author
