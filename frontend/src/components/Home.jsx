import React, { useEffect, useState } from 'react';
import ArticleCard from './ArticleCard';
import axios from "axios";
import { toast } from 'react-toastify';
import ArticleCardSkeleton from './SkeletonLoader';

const HomePage = () => {
    const [mostLikedArticle, setMostLikedArticle] = useState({});
    const [mostRecentArticle, setMostRecentArticle] = useState({});
    const [likedLoading, setLikedLoading] = useState(true);
    const [recentLoading, setRecentLoading] = useState(true);
    const [error, setError] = useState(false);
    useEffect(() => {
        setLikedLoading(true);
        setRecentLoading(true);
        axios.get(`http://localhost:5555/blog/most-liked`,
            { withCredentials: true })
            .then((response) => {
                setMostLikedArticle(response.data);
                setLikedLoading(false);
            })
            .catch((error) => {
                toast.error(error);
                console.log(error);
                setLikedLoading(false);
                setError(true);
            });
        axios.get(`http://localhost:5555/blog/most-recent`,
            { withCredentials: true })
            .then((response) => {
                setMostRecentArticle(response.data);
                setRecentLoading(false);
            })
            .catch((error) => {
                toast.error(error);
                console.log(error);
                setRecentLoading(false);
                setError(true);
            });
    }, [])
    return (
        <div className="flex-grow bg-black text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    {/* Introduction Section */}
                    <section className="mb-8">
                        <h1 className="text-3xl font-bold mb-4 text-green-400">Welcome to {import.meta.env.VITE_BLOG_NAME}</h1>
                        <p className="text-lg mb-4">
                            {import.meta.env.VITE_BLOG_NAME} is a platform for sharing articles, insights, and discussions on various topics, including technology, science, and more.
                            Whether you're a seasoned professional or just starting out, {import.meta.env.VITE_BLOG_NAME} provides a space for you to express your ideas and connect with like-minded individuals.
                        </p>
                    </section>

                    {!error ? (<><section className="mb-8">
                        {likedLoading ? (<ArticleCardSkeleton />) : (<ArticleCard
                            title={mostLikedArticle.title}
                            subtitle={mostLikedArticle.subtitle}
                            href={`http://localhost:5173/blog/article/${mostLikedArticle.title}`}
                            author={mostLikedArticle.author}
                            date={mostLikedArticle.date}
                            tags={mostLikedArticle.tags}
                            imgSrc={mostLikedArticle.image}
                            likes={mostLikedArticle.likes}
                            liked={mostLikedArticle.liked}
                        />)}
                    </section>
                        <section className="mb-8">
                            {recentLoading ? (<ArticleCardSkeleton />) : (<ArticleCard
                                title={mostRecentArticle.title}
                                subtitle={mostRecentArticle.subtitle}
                                href={`http://localhost:5173/blog/article/${mostRecentArticle.title}`}
                                author={mostRecentArticle.author}
                                date={mostRecentArticle.date}
                                tags={mostRecentArticle.tags}
                                imgSrc={mostRecentArticle.image}
                                likes={mostRecentArticle.likes}
                                liked={mostRecentArticle.liked}
                            />)}
                        </section></>)
                        :
                        (<div className='mb-5 text-red-400'>There was an error retrieving the articles</div>)
                    }

                    {/* Testimonies Section */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">(Fake) Testimonials</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Fake Testimony 1 */}
                            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                                <p className="text-lg mb-4 text-green-400">
                                    "Your Blog has been an invaluable resource for me. I've learned so much from the articles on the platform. Highly recommended!"
                                </p>
                                <p className="text-sm text-gray-400">- John Doe</p>
                            </div>
                            {/* Fake Testimony 2 */}
                            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                                <p className="text-lg mb-4 text-green-400">
                                    "I love how easy it is to navigate through Your Blog and find articles that interest me. Every time I read an article, I discover new things and grow my knowledge."
                                </p>
                                <p className="text-sm text-gray-400">- Jane Smith</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
