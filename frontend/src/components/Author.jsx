
import React from 'react';
import ArticleCard from './ArticleCard';

// Sample data for testing
const authorData = {
    username: 'john_doe',
    joinDate: 'January 1, 2020',
    bio: 'I am a tech enthusiast and a blogger. I write about AI, machine learning, and data science.'
};

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
    return (
        <div className='bg-black p-6 text-green-400 min-h-screen'>
            <div className="my-5 max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-4">
                        <img
                            alt={authorData.username}
                            src="https://via.placeholder.com/64"
                            className="w-16 h-16 rounded-full mr-4"
                        />
                        <div>
                            <h2 className="text-2xl font-bold">{authorData.username}</h2>
                            <p className="text-sm text-gray-400">Joined: {authorData.joinDate}</p>
                        </div>
                    </div>
                    <p className="text-gray-300">{authorData.bio}</p>
                </div>
                {authorArticles.length > 0 && (
                    <>
                        <hr className='mt-6'/>
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
