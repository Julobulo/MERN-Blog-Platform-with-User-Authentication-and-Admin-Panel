import React, { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import formatDate from "../utils/formatDate";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import Cookies from "js-cookie";

const App = () => {
    const blocks = [
        {
            "id": "c585f24a-acd8-4b14-b00c-36186adaf418",
            "type": "heading",
            "props": {
                "textColor": "default",
                "backgroundColor": "default",
                "textAlignment": "left",
                "level": 1
            },
            "content": [
                {
                    "type": "text",
                    "text": "My amazing title",
                    "styles": {}
                }
            ],
            "children": []
        },
        {
            "id": "d409714c-b9c5-480e-a25d-0e6cf19c522c",
            "type": "paragraph",
            "props": {
                "textColor": "default",
                "backgroundColor": "default",
                "textAlignment": "left"
            },
            "content": [
                {
                    "type": "text",
                    "text": "Start writing your amazing article!",
                    "styles": {}
                }
            ],
            "children": [
                {
                    "id": "439a06f9-ffea-4705-b5e1-3dcd7a893c2d",
                    "type": "paragraph",
                    "props": {
                        "textColor": "default",
                        "backgroundColor": "default",
                        "textAlignment": "left"
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "balala",
                            "styles": {}
                        }
                    ],
                    "children": [
                        {
                            "id": "25c18b51-d15e-4ea6-8da3-4f0b9a65130b",
                            "type": "bulletListItem",
                            "props": {
                                "textColor": "default",
                                "backgroundColor": "default",
                                "textAlignment": "left"
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "text": "1st",
                                    "styles": {}
                                }
                            ],
                            "children": []
                        },
                        {
                            "id": "378d2f8c-5864-4972-ba4a-29a2765e2fc2",
                            "type": "bulletListItem",
                            "props": {
                                "textColor": "default",
                                "backgroundColor": "default",
                                "textAlignment": "left"
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "text": "2nd",
                                    "styles": {}
                                }
                            ],
                            "children": []
                        }
                    ]
                },
                {
                    "id": "831ab783-2d53-4ea5-87c2-2ed1903536fa",
                    "type": "paragraph",
                    "props": {
                        "textColor": "default",
                        "backgroundColor": "default",
                        "textAlignment": "left"
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "balal",
                            "styles": {}
                        }
                    ],
                    "children": [
                        {
                            "id": "c3a62bdb-016a-4536-9d04-f7d23cc38ad6",
                            "type": "numberedListItem",
                            "props": {
                                "textColor": "default",
                                "backgroundColor": "default",
                                "textAlignment": "left"
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "text": "point",
                                    "styles": {}
                                }
                            ],
                            "children": []
                        },
                        {
                            "id": "0f4e2201-e335-48ff-83a3-70370ec9945a",
                            "type": "numberedListItem",
                            "props": {
                                "textColor": "default",
                                "backgroundColor": "default",
                                "textAlignment": "left"
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "text": "other point",
                                    "styles": {}
                                }
                            ],
                            "children": []
                        }
                    ]
                }
            ]
        },
        {
            "id": "997d1fc2-3ea5-4cc8-93a9-748851075577",
            "type": "bulletListItem",
            "props": {
                "textColor": "default",
                "backgroundColor": "default",
                "textAlignment": "left"
            },
            "content": [
                {
                    "type": "text",
                    "text": "hello",
                    "styles": {}
                }
            ],
            "children": []
        },
        {
            "id": "e7853a07-70be-4299-9216-9ce619af39b8",
            "type": "bulletListItem",
            "props": {
                "textColor": "default",
                "backgroundColor": "default",
                "textAlignment": "left"
            },
            "content": [
                {
                    "type": "text",
                    "text": "I'm",
                    "styles": {}
                }
            ],
            "children": []
        },
        {
            "id": "8b71eabf-bbee-4cd5-9894-4a9cc1fed9db",
            "type": "bulletListItem",
            "props": {
                "textColor": "default",
                "backgroundColor": "default",
                "textAlignment": "left"
            },
            "content": [
                {
                    "type": "text",
                    "text": "Someone",
                    "styles": {}
                }
            ],
            "children": []
        },
        {
            "id": "ac8f302d-2e25-4a20-a5ab-33a4bd570503",
            "type": "paragraph",
            "props": {
                "textColor": "default",
                "backgroundColor": "default",
                "textAlignment": "left"
            },
            "content": [],
            "children": []
        }
    ];
    const { title } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [articleData, setArticleData] = useState({});
    const [liked, setLiked] = useState(false);
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
    const renderBlock = (block) => {
        const { id, type, props, content, children } = block;

        const renderBlockByType = (type) => {
            switch (type) {
                case 'heading':
                    numberedListIteration = 0;
                    const HeadingTag = `h${props.level}`;
                    return (
                        <HeadingTag key={id} className={`${props.level === 1 ? 'text-5xl mb-5' : props.level === 2 ? 'text-3xl mb-4' : 'text-2xl mb-3'} font-bold text-gray-300 mx-8`}>
                            {renderContent(content)}
                        </HeadingTag>
                    );
                case 'paragraph':
                    numberedListIteration = 0;
                    return <p key={id} className="text-base mb-4 mx-8" {...props}>{renderContent(content)}</p>;
                case 'numberedListItem':
                    numberedListIteration += 1;
                    return <ol>
                        <li key={id} className="text-gray-300 mx-8 mb-2" {...props}>{numberedListIteration}. {renderContent(content)}</li>
                    </ol>;
                case 'bulletListItem':
                    numberedListIteration = 0;
                    return <li key={id} className="text-gray-300 mx-12 mb-2" {...props}>{renderContent(content)}</li>;
                case 'checkListItem':
                    numberedListIteration = 0;
                    return (
                        <div key={id} className="flex items-center mb-2 mx-8">
                            <input
                                type="checkbox"
                                checked={props.checked}
                                className="mr-2"
                                disabled
                            />
                            <span style={{ textAlign: props.textAlignment }} className={props.checked && 'line-through'} >{renderContent(content)}</span>
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
                    <div className="children">
                        {children.map(renderBlock)}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex-grow bg-black text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    {/* <Article
                        title={articleData.title}
                        subtitle={articleData.subtitle}
                        author={articleData.author}
                        content={articleData.main}
                        imgSrc={articleData.image}
                        tags={articleData.tags}
                        likes={articleData.likes}
                        date={articleData.date}
                        relatedArticles={relatedArticles}
                    /> */}
                    <div className="p-6 mb-8 bg-[#1f2937] rounded-xl shadow-md">
                        {loading ? (<Spinner />) : (
                            <>
                                <h1 className="text-3xl font-bold mb-4 text-green-400">{articleData.title}</h1>
                                <div className="flex justify-between mb-4">
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
                                <img
                                    alt={articleData.title}
                                    src={articleData.image}
                                    className="mb-5 w-full rounded-xl bg-no-repeat object-cover object-center"
                                />
                                <div>
                                    {articleData.subtitle}
                                </div>
                                <hr className="my-10" />
                                {/* <div dangerouslySetInnerHTML={{ __html: articleData.main }} className="text-gray-300">
                                </div> */}
                                <div className="article">
                                    {articleData.main.map(renderBlock)}
                                </div>
                            </>)}
                        <hr className="my-6 border-t border-gray-700" />
                        <h2 className="text-2xl font-bold mb-4 text-green-400">Suggested Articles</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {relatedArticles.map((article, index) => (
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;

const articleContent = (
    <>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
            <br />
            <br />
            Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.
            <br />
            <br />
            Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna.<br /><br />Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa.<br /><br />Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede. Ut orci risus, accumsan porttitor, cursus quis, aliquet eget, justo. Sed pretium blandit orci.<br /><br />Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.<br /><br />Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.<br /><br />Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna.<br /><br />Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa.<br /><br />Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede. Ut orci risus, accumsan porttitor, cursus quis, aliquet eget, justo. Sed pretium blandit orci.<br /><br />Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.<br /><br />Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.<br /><br />Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna.<br /><br />Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa.<br /><br />Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede. Ut orci risus, accumsan porttitor, cursus quis, aliquet eget, justo. Sed pretium blandit orci.<br /><br />Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.<br /><br />Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.<br /><br />Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna.
            <br /><br />Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa.<br /><br />Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede. Ut orci risus, accumsan porttitor, cursus quis, aliquet eget, justo. Sed pretium blandit orci.<br /><br />Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede. Ut orci risus, accumsan porttitor, cursus quis, aliquet eget, justo. Sed pretium blandit orci.<br />Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede. Ut orci risus, accumsan porttitor, cursus quis, aliquet eget, justo. Sed pretium blandit orci.
            <br />
            Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Pro.
            <br />
            <br />
        </p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
            <br />
            <br />
            Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.
            <br />
            <br />
            Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna.<br /><br />Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa.<br /><br />Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede. Ut orci risus, accumsan porttitor, cursus quis, aliquet eget, justo. Sed pretium blandit orci.<br /><br />Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.<br /><br />Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.<br /><br />Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna.<br /><br />Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa.<br /><br />Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede. Ut orci risus, accumsan porttitor, cursus quis, aliquet eget, justo. Sed pretium blandit orci.<br /><br />Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.<br /><br />Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.<br /><br />Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna.<br /><br />Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa.<br /><br />Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede. Ut orci risus, accumsan porttitor, cursus quis, aliquet eget, justo. Sed pretium blandit orci.<br /><br />Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.<br /><br />Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.<br /><br />Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna.
            <br /><br />Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa.<br /><br />Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede. Ut orci risus, accumsan porttitor, cursus quis, aliquet eget, justo. Sed pretium blandit orci.<br /><br />Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede. Ut orci risus, accumsan porttitor, cursus quis, aliquet eget, justo. Sed pretium blandit orci.<br />Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede. Ut orci risus, accumsan porttitor, cursus quis, aliquet eget, justo. Sed pretium blandit orci.
            <br />
            Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Pro.
            <br />
            <br />
        </p>
    </>
);

const relatedArticles = [
    {
        title: "The Future of AI in Healthcare",
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
    }
];
