import React, { useState, useEffect } from "react";
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { toast } from "react-toastify";

const CreateForm = ({ pageTitle, defaultImage, defaultTitle, defaultSubtitle, defaultTags, defaultMainContent }) => {
    const [image, setImage] = useState();
    const [title, setTitle] = useState();
    const [subtitle, setSubtitle] = useState();
    const [tags, setTags] = useState([]);
    const [mainContent, setMainContent] = useState();
    const [tagInput, setTagInput] = useState('');

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        const maxSize = 1 * 1024 * 1024; // 1MB

        if (file) {
            if (!file.type.startsWith('image/')) {
                setImage('');
                event.target.value = '';
                toast.error('Please upload an image file.');
                return;
            }
            if (file.size > maxSize) {
                setImage('');
                event.target.value = '';
                toast.error('File size exceeds 1MB.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

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
        const articleData = {
            image,
            title,
            subtitle,
            tags,
            main: mainContent,
        };

        try {
            const response = await axios.post('http://localhost:5555/blog/create', articleData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            });
            console.log(response.data);
            // Handle success (e.g., show a success message or redirect)
        } catch (error) {
            console.error(error);
            // Handle error (e.g., show an error message)
        }
    };

    const toolbarOptions = [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        [{ align: [] }],
        [{ color: [] }],
        ["code-block"],
        ["clean"],
    ];

    useEffect(() => {
        const quill = new Quill('#editor', {
            modules: {
                toolbar: {
                    container: toolbarOptions,
                },
            },
            theme: 'snow',
        });

        quill.on('text-change', () => {
            setMainContent(quill.root.innerHTML);
        });

        return () => {
            quill.off('text-change');
            // quill.dispose();
        };
    }, []);

    return (
        <div className="bg-black p-6 text-green-400">
            <div className="my-5 max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">{pageTitle} Post</h1>
                <div className="mb-4">
                    <label htmlFor="image" className="block text-sm font-medium mb-1">Image (it will appear on the article display)</label>
                    <input
                        id="profilePicture"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={`The Future of Quantum Computing`}
                        className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-green-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="subtitle" className="block text-sm font-medium mb-1">Subtitle</label>
                    <input
                        type="text"
                        id="subtitle"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder={`Curious about the future of Quantum Computing? Check out this article!`}
                        className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-green-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="tags" className="block text-sm font-medium mb-1">Tags (up to 4)</label>
                    <input
                        type="text"
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        placeholder={`Press Enter or comma to add tag (ex: "Quantum Computing", "Science", "Future", ...)`}
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
                <div className="mb-4 text-white">
                    <label htmlFor="mainContent" className="text-green-400 block text-sm font-medium mb-1">Content</label>
                    <div id="editor" style={{ height: "300px" }}></div>
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