import React, { useState, useEffect } from "react";
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { toast } from "react-toastify";
import { MdExitToApp } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import Cookies from "js-cookie";

// import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "./CreateForm.css";

const CreateForm = ({ pageTitle, articleData }) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!Cookies.get('token')) {
            navigate('/login')
        }
    }, [navigate])

    const addMissingStyles = (blocks) => {
        if (!Array.isArray(blocks)) {
            console.error("Expected blocks to be an array, but got:", blocks);
            return [];
        }
        return blocks.map(block => {
            if (block.content && Array.isArray(block.content)) { // adding styles field to content field
                if (block.type === "table") {
                    block.content = block.content[0];
                    if (block.content.rows.length > 0) {
                        console.log(`table's got rows: ${JSON.stringify(block.content.rows, null, 2)}`);
                        block.content.rows.forEach(row => {
                            row.cells.forEach(cellGroup => {
                                if (Array.isArray(cellGroup)) {
                                    cellGroup.forEach(cell => {
                                        cell.styles = cell.styles || {};
                                    });
                                }
                            });
                        });
                        console.log(`table block after adding styles: ${JSON.stringify(block, null, 2)}`);
                    }
                }
                else {
                    block.content = block.content.map(item => {
                        return {
                            ...item,
                            styles: item.styles || {}
                        };
                    });
                }
            }
            // Check for children and recursively call addMissingStyles
            if (block.children && block.children.length > 0) {
                block.children = addMissingStyles(block.children);
            }
            return block;
        });
    };
    if (pageTitle === "Edit") {
        articleData = {
            ...articleData,
            main: addMissingStyles(articleData.main),
        }
    }
    const [tagInput, setTagInput] = useState('');
    const [image, setImage] = useState(pageTitle === 'Edit' ? articleData.image : localStorage.getItem('image'));
    const [tags, setTags] = useState(pageTitle === 'Edit' ? articleData.tags : localStorage.getItem('tags').split(','));
    const [blocks, setBlocks] = useState(pageTitle === 'Edit' ? articleData.main : (localStorage.getItem('blocks') ? addMissingStyles(JSON.parse(localStorage.getItem('blocks'))) : []));

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        const maxSize = 1 * 1024 * 1024; // 1MB
        if (file) {
            // Check image
            localStorage.setItem('image', '');
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
            if (file.size > (maxSize / 2)) {
                // compress image
                const compressedFile = await imageCompression(file, {
                    maxSizeMB: maxSize / 2,          // Maximum size in MB, in our case 512kb
                    maxWidthOrHeight: 1920, // Maximum width or height
                    useWebWorker: true,    // Use web worker for compression
                });
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImage(reader.result);
                    if (pageTitle === "Create") { localStorage.setItem('image', reader.result) }
                };
                reader.readAsDataURL(compressedFile);
            }
            else {
                // no need to compress image in that case
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImage(reader.result);
                    if (pageTitle === "Create") { localStorage.setItem('image', reader.result) }
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleTagInputKeyDown = (e) => {
        if ((e.key === 'Enter' || e.key === ',') && tagInput.trim() && tags.length < 4) {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag.length < 2 || newTag.length > 20) {
                toast.error('Tags have to be between 2 and 20 characters.');
                return; // Exit early if the tag is invalid
            }
            setTags([...tags, newTag]);
            localStorage.setItem('tags', [...tags, newTag]);
            setTagInput('');
        }
    };

    const handleTagRemove = (index) => {
        setTags(tags.filter((_, i) => i !== index));
        localStorage.setItem('tags', tags.filter((_, i) => i !== index));
    };

    const handlePost = async () => {
        if (!image) {
            toast.error('You have to upload an image.');
            return;
        }
        if (!tags[0]) {
            toast.error('You have to include at least one tag.');
            return;
        }
        if (blocks.length > 1000) {
            toast.error(`Article can't have more than 1000 blocks`);
            return;
        }
        if (blocks[0].content[0].text.length > 200 || blocks[0].content[0].text.length < 10) {
            toast.error(`Title can't be more than 200 characters and less than 10!`);
            return;
        }
        articleData = {
            ...articleData,
            image,
            blocks,
            tags,
        };

        if (pageTitle === "Create") {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/blog/new`, articleData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            });
            console.log(`Title will be "${blocks[0].content[0].text}"`);
            localStorage.removeItem('image');
            localStorage.removeItem('tags');
            localStorage.removeItem('blocks');
            navigate(`/blog/article/${blocks[0].content[0].text}`);
            toast.success(response.data.message);
            console.log(response.data.message);
        }
        else if (pageTitle === "Edit") {
            console.log(`articleData before saving: ${JSON.stringify(articleData)}`);
            const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/blog/edit/${articleData._id}`, articleData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            });
            console.log(`Title will be "${blocks[0].content[0].text}"`)
            navigate(`/blog/article/${blocks[0].content[0].text}`);
            toast.success(response.data.message);
            console.log(response.data.message);
        };
    }

    // Creates a new editor instance.
    const editor = useCreateBlockNote(
        pageTitle === 'Edit' || blocks.length > 0 && {initialContent: (pageTitle === 'Edit' ? articleData.main : blocks)},
    );

    return (
        <div className="flex-grow bg-black p-6 text-green-400">
            <div className="my-5 max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">{pageTitle} Post</h1>
                <div className="mb-4">
                    <label htmlFor="image" className="block text-sm font-medium mb-1">Image (it will appear on the article display)</label>
                    <div className='flex flex-row items-center'>
                        {image && <div className="basis-1/2">
                            <img src={image} alt={"image selected"} className="mx-auto p-2" />
                        </div>}
                        <div className={`${image ? 'basis-1/2' : 'basis-full'}`}>
                            <input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="editor" className="block text-sm font-medium mb-1">Article (this is the actual article, including the title)</label>
                    <BlockNoteView
                        editor={editor}
                        id="editor"
                        onChange={() => {
                            setBlocks(editor.document); // Saves the document JSON to state.
                            localStorage.setItem('blocks', JSON.stringify(editor.document));
                        }}
                        className="mb-5"
                    />
                    {/* {blocks && (
                        <div>
                            <pre>
                                {JSON.stringify(blocks, null, "\t")}
                            </pre>
                        </div>
                    )} */}
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