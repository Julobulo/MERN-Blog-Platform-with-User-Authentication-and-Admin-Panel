import React, { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import formatDate from "../utils/formatDate";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { RiFile2Line } from "react-icons/ri";
import Cookies from "js-cookie";

const App = () => {
    const { title } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [articleData, setArticleData] = useState({});
    const [liked, setLiked] = useState(false);
    const [relatedArticles, setRelatedArticles] = useState([]);
    let numberedListIteration = 0;
    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:5555/blog/article/${title}`,
            { withCredentials: true })
            .then((response) => {
                setArticleData(response.data);
                setLiked(response.data.liked);
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error.response.data);
                setLoading(false);
            })
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:5555/blog/related/${title}`,
            { withCredentials: true })
            .then((response) => {
                setRelatedArticles(response.data);
            })
            .catch((error) => {
                toast.error(error.response.data);
            })
    }, []);

    function handleLike() {
        if (!Cookies.get('token')) {
            navigate('/login');
        }
        else {
            axios.post(`http://localhost:5555/blog/article/${title}`, {},
                { withCredentials: true })
                .then((response) => {
                    setLiked(!liked);
                    if (liked) {
                        articleData.likes -= 1;
                    }
                    else {
                        articleData.likes += 1;
                    }
                    console.log(response.data.message);
                })
                .catch((error) => {
                    toast.error(error.response.data.message);
                    console.log(error.response.data.message);
                })
        }
    }

    const displayMain = () => {
        return (JSON.stringify(articleData.main))
    }

    // Function to render the content of a block
    const renderContent = (content) => {
        return content.map((item, index) => {
            switch (item.type) {
                case 'text':
                    return <span key={index} style={item.styles}>{item.text}</span>;
                default:
                    return null;
            }
        });
    };

    // Function to render a single block and its children
    const renderBlock = (block, isChild = false) => {
        const { id, type, props, content, children } = block;

        const renderBlockByType = (type) => {
            console.log(`block type: ${type}, isChild: ${isChild}`)
            switch (type) {
                case 'heading':
                    numberedListIteration = 0;
                    const HeadingTag = `h${props.level}`;
                    return (
                        <HeadingTag key={id} className={`${props.level === 1 ? 'text-5xl mb-5' : props.level === 2 ? 'text-3xl mb-4' : 'text-2xl mb-3'} font-bold text-gray-300 mx-${isChild ? '0' : '8'}`}>
                            {renderContent(content)}
                        </HeadingTag>
                    );
                case 'numberedListItem':
                    numberedListIteration += 1;
                    return <ol>
                        <li key={id} className={`text-gray-300 mx-${isChild ? '0' : '8'} mb-2`} {...props}>{numberedListIteration}. {renderContent(content)}</li>
                    </ol>;
                case 'bulletListItem':
                    numberedListIteration = 0;
                    return <li key={id} className={`text-gray-300 mx-${isChild ? '4' : '12'} mb-2`} {...props}>{renderContent(content)}</li>;
                case 'checkListItem':
                    numberedListIteration = 0;
                    return (
                        <div key={id} className={`flex items-center mb-2 mx-${isChild ? '0' : '8'}`}>
                            <input
                                type="checkbox"
                                checked={props.checked}
                                className="mr-2"
                                disabled
                            />
                            <span style={{ textAlign: props.textAlignment }} className={props.checked && 'line-through'} >{renderContent(content)}</span>
                        </div>
                    );
                case 'paragraph':
                    numberedListIteration = 0;
                    return <p key={id} className={`text-gray-300 mb-4 mx-${isChild ? '0' : '8'}`} {...props}>{renderContent(content)}</p>;
                case 'table':
                    return (
                        <table key={id} className={`border-gray-300 mx-${isChild ? '0' : '8'} mb-6 text-gray-300`}>
                            <tbody>
                                {content[0].rows.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="border border-gray-300">
                                        {row.cells.map((cell, cellIndex) => (
                                            <td key={cellIndex} className="border border-gray-300 p-2">
                                                {cell.map((cellContent, contentIndex) => (
                                                    <div key={contentIndex}>
                                                        {renderContent([cellContent])}
                                                    </div>
                                                ))}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    );
                case "image":
                    return (
                        <img className={`my-3 mx-${isChild ? '0' : '8'}`} src={props.url} alt={props.caption} width={props.previewWidth} />
                    )
                case 'video':
                    return (
                        <div key={id} className={`mx-${isChild ? '0' : '8'}`}>
                            <video controls={props.controls !== undefined ? props.controls : true} width={props.previewWidth}>
                                <source src={props.url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            {props.caption && <p className="text-gray-300 mt-2">{props.caption}</p>}
                        </div>
                    );
                case 'audio':
                    return (
                        <div key={id} className={`my-3 mx-${isChild ? '0' : '8'}`}>
                            <audio controls={props.controls !== undefined ? props.controls : true}>
                                <source src={props.url} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                            {props.caption && <p className="text-gray-300 mt-2">{props.caption}</p>}
                        </div>
                    );
                case 'file':
                    return (
                        <div key={id} className={`my-3 mx-${isChild ? '0' : '8'} flex items-center text-gray-300`}>
                            <RiFile2Line className="mx-1 text-2xl" />
                            <a href={props.url} download={props.name}>
                                {props.name || "Download File"}
                            </a>
                            {props.caption && <p className="mt-2">{props.caption}</p>}
                        </div>
                    );
                default:
                    numberedListIteration = 0;
                    return null;
            }
        };

        return (
            <div key={id}>
                {renderBlockByType(type)}
                {children && children.length > 0 && (
                    <div className={`border-l border-gray-500 ${isChild ? 'ml-1' : 'ml-9'} pl-4`}>
                        {children.map(childBlock => renderBlock(childBlock, true))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex-grow bg-black text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="p-6 mb-8 bg-[#1f2937] rounded-xl shadow-md">
                        {loading ? (<Spinner />) : (
                            <>
                                <h1 className="text-5xl font-bold mb-4 text-green-400 mx-8">{articleData.title}</h1>
                                <div className="flex justify-between mb-4 mx-8">
                                    <a href={`/author/${articleData.author}`} className="font-medium text-green-400">
                                        <div className="flex items-center space-x-2">
                                            <img
                                                alt={articleData.author}
                                                src="https://via.placeholder.com/32"
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div className="flex flex-col">
                                                <span>{articleData.author}</span>
                                                <span className="text-sm text-gray-400">{formatDate(articleData.date)}</span>
                                            </div>
                                        </div>
                                    </a>
                                    <div className="flex items-center space-x-2">
                                        <button className="text-red-500" onClick={() => handleLike()}>
                                            {liked ?
                                                (<FaHeart />)
                                                :
                                                (<FaRegHeart />)
                                            }
                                        </button>
                                        <span className='text-red-500'>{articleData.likes}</span>
                                    </div>
                                </div>
                                <div className="mx-8">
                                    <img
                                        alt={articleData.title}
                                        src={articleData.image}
                                        className="mb-5 rounded-xl w-full object-cover"
                                    />
                                </div>
                                <hr className="my-10 mx-8" />
                                <div className="article">
                                    {articleData.main.slice(1).map(block => renderBlock(block, false))}
                                </div>
                            </>)}
                        {relatedArticles && (
                            <>
                                <hr className="my-6 border-t border-gray-700" />
                                <h2 className="text-2xl font-bold mb-4 text-green-400">Suggested Articles</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {relatedArticles.map((article, index) => (
                                        <ArticleCard
                                            key={index}
                                            title={article.title}
                                            title_highlighted={article.title_highlighted}
                                            subtitle={article.subtitle}
                                            author={article.author}
                                            author_highlighted={article.author_highlighted}
                                            date={article.date}
                                            tags={article.tags}
                                            imgSrc={article.image}
                                            likes={article.likes}
                                            liked={article.liked}
                                        />
                                    ))}
                                </div>
                            </>)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;