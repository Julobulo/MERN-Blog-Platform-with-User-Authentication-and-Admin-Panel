import React, { useState } from "react";
import ArticleCard from "../ArticleCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const article = {
    title: "The Rise of Artificial Intelligence in Modern Society",
    description: "Explore how AI is transforming the healthcare industry, from diagnostics to treatment.",
    href: "#",
    author: "Jane Doe",
    date: "June 1, 2024",
    tags: ["AI", "Healthcare"],
    imgSrc: "https://via.placeholder.com/300",
    hearts: 120
}

const ArticleDelete = () => {
    const [isDeleted, setIsDeleted] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleDelete = async () => {
        axios.delete('http://localhost:5555/blog/delete', { data: { title: article.title } })
            .then((response) => {
                setIsDeleted(true);
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    navigate('/login');
                }
                setError('Failed to delete the article.');
            })
    };

    const confirmDelete = () => {
        setIsConfirming(true);
    };

    const cancelDelete = () => {
        setIsConfirming(false);
    };

    if (error) {
        return (
            <div className="bg-black p-6 text-green-400">
                <div className="my-5 max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md text-center">
                    <p>{error}</p>
                </div>
            </div>
        );
    }
    if (isDeleted) {
        return (
            <div className="bg-black p-6 text-green-400">
                <div className="my-5 max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md text-center">
                    <h1 className="text-2xl font-bold mb-6">Article Deleted</h1>
                    <p>The article has been successfully deleted.</p>
                </div>
            </div>
        );
    }
    return (

        <div className="flex-grow bg-black p-6 text-green-400">
            <div className="my-5 max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Delete Article</h1>
                <ArticleCard
                    title={article.title}
                    description={article.description}
                    href={article.href}
                    author={article.author}
                    date={article.date}
                    tags={article.tags}
                    imgSrc={article.imgSrc}
                    hearts={article.hearts}
                />
                <div className="mt-5 text-center">
                    {isConfirming ? (
                        <div className="text-center">
                            <p className="mb-4">Are you sure you want to delete this article?</p>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mr-4"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="bg-gray-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={confirmDelete}
                            className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Delete Article
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ArticleDelete