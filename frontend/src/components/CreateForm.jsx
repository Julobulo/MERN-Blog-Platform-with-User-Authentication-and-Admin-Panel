import React, { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const CreateForm = ({ pageTitle, defaultImage, defaultTitle, defaultSubtitle, defaultTags, defaultMainContent }) => {
    const [image, setImage] = useState(defaultImage);
    const [title, setTitle] = useState(defaultTitle);
    const [subtitle, setSubtitle] = useState(defaultSubtitle);
    const [tags, setTags] = useState(defaultTags);
    const [mainContent, setMainContent] = useState(defaultMainContent);
    const [tagInput, setTagInput] = useState('');

    const handleTagInputKeyDown = (e) => {
        if ((e.key === 'Enter' || e.key === ',') && tagInput.trim() && tags.length < 4) {
            e.preventDefault();
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleTagRemove = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const handlePost = async () => {
        const postData = {
            title,
            subtitle,
            tags,
            main: mainContent,
            image,
        };

        try {
            const response = await axios.post('http://localhost:5555/blog/create', postData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
            // Handle success (e.g., show a success message or redirect)
        } catch (error) {
            console.error(error);
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <div className="bg-black p-6 text-green-400">
            <div className="my-5 max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">{pageTitle} Post</h1>
                <div className="mb-4">
                    <label htmlFor="image" className="block text-sm font-medium">Image URL (it will appear on the article display)</label>
                    <input
                        type="text"
                        id="image"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="Enter image URL (ex: https://upload.wikimedia.org/wikipedia/commons/a/a7/Lorem_Ipsum_Article.png?20150528112327)"
                        className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-green-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={`How to make banana shakes`}
                        className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-green-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="subtitle" className="block text-sm font-medium">Subtitle</label>
                    <input
                        type="text"
                        id="subtitle"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder={`Hey everybody! Ever wanted to learn how to make banana shakes? This guide is for you!`}
                        className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-green-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="tags" className="block text-sm font-medium">Tags (up to 4)</label>
                    <input
                        type="text"
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        placeholder={`Press Enter or comma to add tag (ex: "banana", "recipe", "shake", ...)`}
                        className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-green-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                    <div className="mt-2 flex flex-wrap">
                        {tags.map((tag, index) => (
                            <span key={index} className="bg-gray-800 border border-gray-700 rounded-full px-3 py-1 text-xs mr-2 mt-2">
                                {tag} <button type="button" onClick={() => handleTagRemove(index)} className="ml-1 text-red-500">×</button>
                            </span>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="mainContent" className="block text-sm font-medium">Content</label>
                    <ReactQuill
                        value={mainContent}
                        onChange={setMainContent}
                        className="bg-gray-800 text-white"
                    />
                </div>
                <button
                    onClick={handlePost}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    {pageTitle === 'Create' ? 'Create' : 'Save'}
                </button>
            </div>
        </div>
    );
};


export default CreateForm