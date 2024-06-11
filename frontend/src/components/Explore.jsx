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

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:5555/blog/articles')
            .then((response) => {
                setArticles(response.data);
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error.response.data);
                setLoading(false);
            })
    }, [])

    // const filteredArticles = articles.filter(article =>
    //     article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     article.description.toLowerCase().includes(searchQuery.toLowerCase())
    // );
    return (
        <div className="min-h-screen bg-black md:p-6 p-0">
            <div className="md:p-6 p-2">
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={handleSearchChange}
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
                            description={article.subtitle}
                            href={`http://localhost:5173/blog/article/${article.title}`}
                            author={article.author}
                            date={article.date}
                            tags={article.tags}
                            imgSrc={article.image}
                            hearts={article.likes}
                        />
                    )))
                    }
                </div>
            </div>
        </div>
    );
}


const articles = [
    {
        title: "The Rise of Artificial Intelligence in Modern Society",
        description: "Explore how AI is transforming the healthcare industry, from diagnostics to treatment.",
        href: "#",
        author: "Jane Doe",
        date: "June 1, 2024",
        tags: ["AI", "Healthcare"],
        imgSrc: "https://via.placeholder.com/300",
        hearts: 120
    },
    {
        title: "AI and Financial Services",
        description: "Discover the ways AI is revolutionizing the financial sector and enhancing security.",
        href: "#",
        author: "John Smith",
        date: "May 20, 2024",
        tags: ["AI", "Finance"],
        imgSrc: "https://via.placeholder.com/300",
        hearts: 98
    },
    {
        title: "AI and Financial Services",
        description: "Discover the ways AI is revolutionizing the financial sector and enhancing security.",
        href: "#",
        author: "John Smith",
        date: "May 20, 2024",
        tags: ["AI", "Finance"],
        imgSrc: "https://via.placeholder.com/300",
        hearts: 98
    },
    {
        title: "AI and Financial Services",
        description: "Discover the ways AI is revolutionizing the financial sector and enhancing security.",
        href: "#",
        author: "John Smith",
        date: "May 20, 2024",
        tags: ["AI", "Finance"],
        imgSrc: "https://via.placeholder.com/300",
        hearts: 98
    },
    // Add more articles as needed...
];

export default App;
