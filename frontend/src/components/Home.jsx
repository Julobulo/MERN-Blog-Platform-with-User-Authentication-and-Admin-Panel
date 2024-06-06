import React from 'react';
import ArticleCard from './ArticleCard';

const HomePage = () => {
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
                        <ArticleCard
                            title="The Future of Artificial Intelligence"
                            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non enim nec libero dictum malesuada."
                            href="#"
                            author="John Doe"
                            date="May 30, 2023"
                            tags={["Technology", "AI"]}
                            imgSrc="https://via.placeholder.com/2800x400"
                            hearts={120}
                        />
                    </section>

                    {/* Recent Article Section */}
                    <section className="mb-8">
                        <ArticleCard
                            title="The Rise of Quantum Computing"
                            description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam."
                            href="#"
                            author="Jane Smith"
                            date="June 5, 2023"
                            tags={["Technology", "Quantum Computing"]}
                            imgSrc="https://via.placeholder.com/2800x400"
                            hearts={10}
                        />
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
