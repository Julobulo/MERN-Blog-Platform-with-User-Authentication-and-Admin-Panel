import React from 'react';

const HomePage = () => {
    return (
        <div className="bg-black text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    {/* Introduction Section */}
                    <section className="mb-8">
                        <h1 className="text-3xl font-bold mb-4">Welcome to Your Blog</h1>
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
                                <p className="text-lg mb-4">
                                    "Your Blog has been an invaluable resource for me. I've learned so much from the articles on the platform. Highly recommended!"
                                </p>
                                <p className="text-sm text-gray-400">- John Doe</p>
                            </div>
                            {/* Fake Testimony 2 */}
                            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                                <p className="text-lg mb-4">
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

const ArticleCard = ({ title, description, href, author, date, tags, imgSrc, hearts }) => {
    return (
        <div className="p-6 mb-8 bg-gray-900 rounded-xl shadow-md">
            <a href={href}>
                <img
                    alt={title}
                    src={imgSrc}
                    className="mb-5 h-48 w-full rounded-xl bg-no-repeat object-cover object-center transition-transform duration-200 ease-out hover:scale-[1.02]"
                />
            </a>
            <h2 className="pb-3 text-xl font-semibold tracking-tight">
                <a href={href}>{title}</a>
            </h2>
            <div className="flex justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <img
                        alt={author}
                        src="https://via.placeholder.com/32"
                        className="w-8 h-8 rounded-full"
                    />
                    <div className="flex flex-col">
                        <a href="/author/john-doe" className="font-medium text-green-400">{author}</a>
                        <span className="text-sm text-gray-400">{date}</span>
                    </div>
                </div>
                <div className="flex space-x-2">
                    {tags.map(tag => (
                        <div key={tag} className="flex rounded-full border border-gray-700 bg-gray-800 px-3 py-1 badge">
                            {<span className="text-xs uppercase leading-none text-cyan-300 text-center my-auto">{tag}</span>}
                        </div>
                    ))}
                </div>
            </div>
            <p className="mb-6 text-gray-400">{description}</p>
            <div className="flex items-center justify-between font-medium text-green-400">
                <a href={href} className="flex items-center space-x-2">
                    <span>Read more</span>
                    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-inherit">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12.2929 0.292905C12.6834 -0.097635 13.3166 -0.097635 13.7071 0.292905L21.7072 8.2929C22.0976 8.68342 22.0976 9.31658 21.7072 9.7071L13.7071 17.7072C13.3166 18.0976 12.6834 18.0976 12.2929 17.7072C11.9024 17.3166 11.9024 16.6834 12.2929 16.2928L18.5858 10H1C0.44772 10 0 9.55228 0 9C0 8.44772 0.44772 8 1 8H18.5858L12.2929 1.7071C11.9024 1.31658 11.9024 0.683425 12.2929 0.292905Z" fill="currentColor"></path>
                    </svg>
                </a>
                <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.344l1.172-1.172a4 4 0 015.656 5.656l-1.172 1.172L10 17.828l-5.656-5.656L3.172 10.83a4 4 0 010-5.656zM10 16.172l4.656-4.656a2 2 0 10-2.828-2.828L10 9.344l-1.828-1.828a2 2 0 00-2.828 2.828L10 16.172z" clipRule="evenodd" />
                    </svg>
                    <span className='text-red-500'>{hearts}</span>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
