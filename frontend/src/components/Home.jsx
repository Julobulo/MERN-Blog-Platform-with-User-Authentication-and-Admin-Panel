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
    useEffect(() => {
        setLikedLoading(true);
        setRecentLoading(true);
        axios.get(`http://localhost:5555/blog/most-liked`)
            .then((response) => {
                setMostLikedArticle(response.data);
                setLikedLoading(false);
            })
            .catch((error) => {
                toast.error(error);
                console.log(error);
                setLikedLoading(false);
            });
        axios.get(`http://localhost:5555/blog/most-recent`)
            .then((response) => {
                setMostRecentArticle(response.data);
                setRecentLoading(false);
            })
            .catch((error) => {
                toast.error(error);
                console.log(error);
                setRecentLoading(false);
            });
    }, [])
    return (
        <div className="bg-black text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    {/* Introduction Section */}
                    <section className="mb-8">
                        <h1 className="text-3xl font-bold mb-4 text-green-400">Welcome to Your Blog</h1>
                        <p className="text-lg mb-4">
                            Your Blog is a platform for sharing articles, insights, and discussions on various topics, including technology, science, and more.
                            Whether you're a seasoned professional or just starting out, Your Blog provides a space for you to express your ideas and connect with like-minded individuals.
                        </p>
                    </section>

                    {/* Best Article Section */}
                    <section className="mb-8">
                        {likedLoading ? (<ArticleCardSkeleton />) : (<ArticleCard
                            title={mostLikedArticle.title}
                            description={mostLikedArticle.subtitle}
                            href={`http://localhost:5173/blog/article/${mostLikedArticle.title}`}
                            author={mostLikedArticle.author}
                            date={mostLikedArticle.date}
                            tags={mostLikedArticle.tags}
                            imgSrc={mostLikedArticle.image}
                            hearts={mostLikedArticle.likes}
                        />)}
                    </section>

                    {/* Recent Article Section */}
                    <section className="mb-8">
                        {recentLoading ? (<ArticleCardSkeleton />) : (<ArticleCard
                            title={mostRecentArticle.title}
                            description={mostRecentArticle.subtitle}
                            href={`http://localhost:5173/blog/article/${mostRecentArticle.title}`}
                            author={mostRecentArticle.author}
                            date={mostRecentArticle.date}
                            tags={mostRecentArticle.tags}
                            imgSrc={mostRecentArticle.image}
                            hearts={mostRecentArticle.likes}
                        />)}
                    </section>

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
