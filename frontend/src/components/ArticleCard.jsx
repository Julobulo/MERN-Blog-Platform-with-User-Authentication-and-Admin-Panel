import React, { useState } from "react";
import formatDate from "../utils/formatDate";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ArticleCard = ({ title, title_highlighted, subtitle, href, author, author_highlighted, author_profilePicture, date, tags, imgSrc, likes, liked }) => {
    const [wasLiked, setWasLiked] = useState(liked);
    const [likesNumber, setLikesNumber] = useState(likes);
    const navigate = useNavigate();
    function handleLike() {
        if (!Cookies.get('token')) {
            navigate('/login');
        }
        else {
            axios.post(`http://localhost:5555/blog/article/${title}`, {},
                { withCredentials: true })
                .then((response) => {
                    setWasLiked(!wasLiked);
                    if (wasLiked) {
                        setLikesNumber(likesNumber - 1);
                    }
                    else {
                        setLikesNumber(likesNumber + 1);
                    }
                    console.log(response.data.message);
                })
                .catch((error) => {
                    toast.error(error.response.data.message);
                    console.log(error.response.data.message);
                })
        }
    }
    return (
        <div className="p-6 mb-8 bg-gray-900 rounded-xl shadow-md">
            <a href={`http://localhost:5173/blog/article/${title}`}>
                <img
                    alt={title}
                    src={imgSrc}
                    className="mb-5 h-48 w-full rounded-xl bg-no-repeat object-cover object-center transition-transform duration-200 ease-out hover:scale-[1.02]"
                />
            </a>
            <h2 className="text-xl font-semibold tracking-tight text-white">
                <a href={href} dangerouslySetInnerHTML={{ __html: (title_highlighted ? title_highlighted : title) }}></a>
            </h2>
            <p className="mb-2 text-gray-400" dangerouslySetInnerHTML={{ __html: subtitle }}></p>
            <div className="flex flex-wrap overflow-auto space-x-2 md:hidden pb-2">
                {tags.slice(0, 1).map(tag => (
                    <div key={tag} className="flex rounded-full border border-gray-700 bg-gray-800 px-3 py-1 badge">
                        {<span className="text-xs uppercase leading-none text-green-400 text-center my-auto" dangerouslySetInnerHTML={{ __html: tag }}></span>}
                    </div>
                ))}
            </div>
            <div className="flex justify-between mb-4">
                <a href={`/author/${author}`} className="font-medium text-green-400">
                    <div className="flex items-center space-x-2">
                        <img
                            alt={author}
                            src={author_profilePicture}
                            className="w-8 h-8 rounded-full"
                        />
                        <div className="flex flex-col">
                            <span dangerouslySetInnerHTML={{ __html: (author_highlighted ? author_highlighted : author) }}></span>
                            <span className="text-sm text-gray-400">{formatDate(date)}</span>
                        </div>
                    </div>
                </a>
                <div className="flex items-center space-x-2">
                    <button className="text-red-500" onClick={() => handleLike()}>
                        {wasLiked ?
                            (<FaHeart />)
                            :
                            (<FaRegHeart />)
                        }
                    </button>
                    <span className='text-red-500'>{likesNumber}</span>
                </div>
            </div>
            <div className="flex items-center justify-between font-medium text-green-400">
                <a href={href} className="flex items-center space-x-2">
                    <span>Read more</span>
                    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-inherit">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12.2929 0.292905C12.6834 -0.097635 13.3166 -0.097635 13.7071 0.292905L21.7072 8.2929C22.0976 8.68342 22.0976 9.31658 21.7072 9.7071L13.7071 17.7072C13.3166 18.0976 12.6834 18.0976 12.2929 17.7072C11.9024 17.3166 11.9024 16.6834 12.2929 16.2928L18.5858 10H1C0.44772 10 0 9.55228 0 9C0 8.44772 0.44772 8 1 8H18.5858L12.2929 1.7071C11.9024 1.31658 11.9024 0.683425 12.2929 0.292905Z" fill="currentColor"></path>
                    </svg>
                </a>
                <div className="flex flex-wrap max-w-full max-h-16 overflow-auto space-x-2 max-md:hidden">
                    {tags.slice(0, 2).map(tag => (
                        <div key={tag} className="flex rounded-full border border-gray-700 bg-gray-800 px-3 py-1 badge">
                            {<span className="text-xs uppercase leading-none text-green-400 text-center my-2" dangerouslySetInnerHTML={{ __html: tag }}></span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ArticleCard