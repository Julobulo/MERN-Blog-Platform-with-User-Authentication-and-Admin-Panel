import React, { useEffect, useState } from "react";
import ArticleCard from "../ArticleCard";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../Spinner";

const ArticleDelete = () => {
    const { title } = useParams();
    const [isDeleted, setIsDeleted] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState(null);
    const [articleData, setArticleData] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:5555/blog/article/${title}`,
            { withCredentials: true })
            .then((response) => {
                setArticleData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
                setError(error.response.data.message);
                setLoading(false);
            })
    }, [])

    const handleDelete = async () => {
        axios.delete(`http://localhost:5555/blog/delete/${title}`,
            { withCredentials: true })
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

    if (loading) {
        return (<div className="flex-grow bg-black p-6 text-green-400">
            <div className="my-5 max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md text-center">
                <Spinner />
            </div>
        </div>)
    }
    if (error) {
        return (
            <div className="flex-grow bg-black p-6 text-green-400">
                <div className="my-5 max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md text-center">
                    <h1 className="text-2xl font-bold mb-6">Error</h1>
                    <p>{error}</p>
                </div>
            </div>
        );
    }
    if (isDeleted) {
        return (
            <div className="flex-grow bg-black p-6 text-green-400">
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
                    title={articleData.title}
                    subtitle={articleData.subtitle}
                    href={articleData.href}
                    author={articleData.author}
                    date={articleData.date}
                    tags={articleData.tags}
                    imgSrc={articleData.image}
                    likes={articleData.likes}
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