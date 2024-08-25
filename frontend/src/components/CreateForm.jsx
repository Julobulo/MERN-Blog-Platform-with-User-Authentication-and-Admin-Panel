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
    const [tags, setTags] = useState(pageTitle === 'Edit' ? articleData.tags : []);
    const [blocks, setBlocks] = useState(pageTitle === 'Edit' ? articleData.main : []);

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
            setTagInput('');
        }
    };

    const handleTagRemove = (index) => {
        setTags(tags.filter((_, i) => i !== index));
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
            const response = await axios.post('http://localhost:5555/blog/new', articleData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            });
            console.log(`Title will be "${blocks[0].content[0].text}"`)
            navigate(`/blog/article/${blocks[0].content[0].text}`);
            toast.success(response.data.message);
            console.log(response.data.message);
        }
        else if (pageTitle === "Edit") {
            console.log(`articleData before saving: ${JSON.stringify(articleData)}`);
            const response = await axios.patch(`http://localhost:5555/blog/edit/${articleData._id}`, articleData, {
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
    const editor = useCreateBlockNote({
        initialContent: pageTitle === 'Edit' ? articleData.main : [
            {
                "id": "196f8b2b-a77b-407c-827b-165bc7f329aa",
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
                        "text": "(Create) My amazing title",
                        "styles": {}
                    }
                ],
                "children": []
            },
            {
                "id": "2d638d9c-d802-4fe3-aa79-2f8ab640f23c",
                "type": "heading",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left",
                    "level": 2
                },
                "content": [
                    {
                        "type": "text",
                        "text": "My amazing title 2",
                        "styles": {}
                    }
                ],
                "children": []
            },
            {
                "id": "d5790c1b-c499-4ba1-8a5a-bfafc59ca41d",
                "type": "heading",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left",
                    "level": 3
                },
                "content": [
                    {
                        "type": "text",
                        "text": "My amazing title 3",
                        "styles": {}
                    }
                ],
                "children": []
            },
            {
                "id": "748a1f87-f104-4b55-a2dd-df71cccd7758",
                "type": "numberedListItem",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left"
                },
                "content": [
                    {
                        "type": "text",
                        "text": "hey",
                        "styles": {}
                    }
                ],
                "children": []
            },
            {
                "id": "7954a646-c0d3-407c-b151-0d0141c473a1",
                "type": "numberedListItem",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left"
                },
                "content": [
                    {
                        "type": "text",
                        "text": "ho",
                        "styles": {}
                    }
                ],
                "children": []
            },
            {
                "id": "7aa33c24-a9e7-4162-aa6a-e2d89a4d5d71",
                "type": "numberedListItem",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left"
                },
                "content": [
                    {
                        "type": "text",
                        "text": "hi",
                        "styles": {}
                    }
                ],
                "children": []
            },
            {
                "id": "e93e2b88-93da-449e-9164-c2f0080cda8c",
                "type": "bulletListItem",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left"
                },
                "content": [
                    {
                        "type": "text",
                        "text": "hi",
                        "styles": {}
                    }
                ],
                "children": []
            },
            {
                "id": "d55eedbc-6c22-4198-8e38-1c091b3ab5b4",
                "type": "bulletListItem",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left"
                },
                "content": [
                    {
                        "type": "text",
                        "text": "ho",
                        "styles": {}
                    }
                ],
                "children": []
            },
            {
                "id": "072308b4-68bb-4f97-8266-54765013c2de",
                "type": "bulletListItem",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left"
                },
                "content": [
                    {
                        "type": "text",
                        "text": "hey",
                        "styles": {}
                    }
                ],
                "children": []
            },
            {
                "id": "050f4901-b96f-4afe-9d91-75efb78f9a1b",
                "type": "checkListItem",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left",
                    "checked": false
                },
                "content": [
                    {
                        "type": "text",
                        "text": "some",
                        "styles": {}
                    }
                ],
                "children": []
            },
            {
                "id": "746414d9-0902-47a2-90ec-08b62aadaef0",
                "type": "checkListItem",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left",
                    "checked": true
                },
                "content": [
                    {
                        "type": "text",
                        "text": "thing",
                        "styles": {}
                    }
                ],
                "children": []
            },
            {
                "id": "c4c94623-7fbe-45b4-85f3-5486e707cb9d",
                "type": "checkListItem",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left",
                    "checked": false
                },
                "content": [
                    {
                        "type": "text",
                        "text": "is",
                        "styles": {}
                    }
                ],
                "children": []
            },
            {
                "id": "be56a460-31eb-462e-a237-852208a96fee",
                "type": "checkListItem",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left",
                    "checked": true
                },
                "content": [
                    {
                        "type": "text",
                        "text": "not",
                        "styles": {}
                    }
                ],
                "children": []
            },
            {
                "id": "8c870704-38bc-4ca7-a275-d6f68b72d27d",
                "type": "checkListItem",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left",
                    "checked": true
                },
                "content": [
                    {
                        "type": "text",
                        "text": "right",
                        "styles": {}
                    }
                ],
                "children": []
            },
            {
                "id": "19d038be-e8cd-4a27-bc8b-6a68dc61d95e",
                "type": "paragraph",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left"
                },
                "content": [
                    {
                        "type": "text",
                        "text": "hey that's actually an amazing paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac purus sodales, pulvinar urna in, condimentum orci. Donec blandit neque quis viverra pretium. Integer nisi ex, porta nec nisl id, tincidunt ornare nibh. Sed tempus dui quis sapien aliquam, eu ultrices ante consectetur. Praesent id egestas ligula. Duis et viverra nisl, vulputate venenatis mauris. Aliquam efficitur fringilla ante, in sodales lacus lobortis dictum.",
                        "styles": {}
                    }
                ],
                "children": []
            },
            {
                "id": "10c15bef-5b69-4d91-b113-056ccf8666b3",
                "type": "table",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default"
                },
                "content": {
                    "type": "tableContent",
                    "rows": [
                        {
                            "cells": [
                                [
                                    {
                                        "type": "text",
                                        "text": "this",
                                        "styles": {}
                                    }
                                ],
                                [
                                    {
                                        "type": "text",
                                        "text": "table",
                                        "styles": {}
                                    }
                                ],
                                [
                                    {
                                        "type": "text",
                                        "text": "is",
                                        "styles": {}
                                    }
                                ]
                            ]
                        },
                        {
                            "cells": [
                                [
                                    {
                                        "type": "text",
                                        "text": "going",
                                        "styles": {}
                                    }
                                ],
                                [
                                    {
                                        "type": "text",
                                        "text": "to",
                                        "styles": {}
                                    }
                                ],
                                [
                                    {
                                        "type": "text",
                                        "text": "be",
                                        "styles": {}
                                    }
                                ]
                            ]
                        },
                        {
                            "cells": [
                                [
                                    {
                                        "type": "text",
                                        "text": "difficult",
                                        "styles": {}
                                    }
                                ],
                                [
                                    {
                                        "type": "text",
                                        "text": "to",
                                        "styles": {}
                                    }
                                ],
                                [
                                    {
                                        "type": "text",
                                        "text": "display",
                                        "styles": {}
                                    }
                                ]
                            ]
                        }
                    ]
                },
                "children": []
            },
            {
                "id": "3443540a-6d54-4627-aed9-211bad03a5c7",
                "type": "image",
                "props": {
                    "backgroundColor": "default",
                    "textAlignment": "left",
                    "name": "images?q=tbn:ANd9GcRjk9v6uG9g5AEonjfD_kYL_yoU_H78-w93Vl_SY3USsjtHVT3PXGkEB_oIVAAzb9JiP5A&usqp=CAU",
                    "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjk9v6uG9g5AEonjfD_kYL_yoU_H78-w93Vl_SY3USsjtHVT3PXGkEB_oIVAAzb9JiP5A&usqp=CAU",
                    "caption": "",
                    "showPreview": true,
                    "previewWidth": 512
                },
                "children": []
            },
            {
                "id": "50b159f5-741b-48e7-a946-0442be04d0fe",
                "type": "video",
                "props": {
                    "backgroundColor": "default",
                    "textAlignment": "left",
                    "name": "CompaniesAct.mp4",
                    "url": "https://www.taxmann.com/emailer/images/CompaniesAct.mp4",
                    "caption": "",
                    "showPreview": true,
                    "previewWidth": 512
                },
                "children": []
            },
            {
                "id": "d769e1c4-29a9-45e4-8de9-336a72950396",
                "type": "audio",
                "props": {
                    "backgroundColor": "default",
                    "name": "ff-16b-2c-44100hz.mp3",
                    "url": "https://dl.espressif.com/dl/audio/ff-16b-2c-44100hz.mp3",
                    "caption": "",
                    "showPreview": true
                },
                "children": []
            },
            {
                "id": "af11a54b-bde7-465e-ae6b-f1c18f86cd07",
                "type": "file",
                "props": {
                    "backgroundColor": "default",
                    "name": "dictionary.pdf",
                    "url": "https://css4.pub/2015/icelandic/dictionary.pdf",
                    "caption": ""
                },
                "children": []
            },
            {
                "id": "cc765d9e-cc15-4156-837f-c5d379bd8a84",
                "type": "paragraph",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left"
                },
                "content": [],
                "children": []
            },
            {
                "id": "2b0371da-95a3-4db4-9499-5042472b71fe",
                "type": "paragraph",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left"
                },
                "content": [
                    {
                        "type": "text",
                        "text": "hey",
                        "styles": {}
                    }
                ],
                "children": [
                    {
                        "id": "7419ae7f-5d3b-4161-917b-f0a5492038b9",
                        "type": "paragraph",
                        "props": {
                            "textColor": "default",
                            "backgroundColor": "default",
                            "textAlignment": "left"
                        },
                        "content": [
                            {
                                "type": "text",
                                "text": "i'm",
                                "styles": {}
                            }
                        ],
                        "children": []
                    },
                    {
                        "id": "dfa16917-7f15-4a82-b142-803e231859c9",
                        "type": "paragraph",
                        "props": {
                            "textColor": "default",
                            "backgroundColor": "default",
                            "textAlignment": "left"
                        },
                        "content": [
                            {
                                "type": "text",
                                "text": "also",
                                "styles": {}
                            }
                        ],
                        "children": [
                            {
                                "id": "302561da-7faf-4d26-b5b0-4f7f93bd3b1c",
                                "type": "paragraph",
                                "props": {
                                    "textColor": "default",
                                    "backgroundColor": "default",
                                    "textAlignment": "left"
                                },
                                "content": [
                                    {
                                        "type": "text",
                                        "text": "jules",
                                        "styles": {}
                                    }
                                ],
                                "children": []
                            }
                        ]
                    },
                    {
                        "id": "31c84cf4-1da6-4824-8d86-79818f7545ee",
                        "type": "paragraph",
                        "props": {
                            "textColor": "default",
                            "backgroundColor": "default",
                            "textAlignment": "left"
                        },
                        "content": [
                            {
                                "type": "text",
                                "text": "but",
                                "styles": {}
                            }
                        ],
                        "children": []
                    },
                    {
                        "id": "4bc1188f-bfac-44ba-ad13-3e783c874f48",
                        "type": "paragraph",
                        "props": {
                            "textColor": "default",
                            "backgroundColor": "default",
                            "textAlignment": "left"
                        },
                        "content": [
                            {
                                "type": "text",
                                "text": "not",
                                "styles": {}
                            }
                        ],
                        "children": []
                    }
                ]
            },
            {
                "id": "0bd1ab09-0078-4024-8cfd-bc0379fd5469",
                "type": "paragraph",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left"
                },
                "content": [
                    {
                        "type": "text",
                        "text": "really",
                        "styles": {}
                    }
                ],
                "children": []
            },
            {
                "id": "75d31ce2-d636-4ead-bf9f-af91fbd91977",
                "type": "paragraph",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left"
                },
                "content": [],
                "children": []
            },
            {
                "id": "f5323492-6403-4c53-adf8-733cca987a99",
                "type": "paragraph",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left"
                },
                "content": [
                    {
                        "type": "text",
                        "text": "i'm",
                        "styles": {}
                    }
                ],
                "children": []
            },
            {
                "id": "39616fa4-e607-4597-967e-5e7a6d9069a0",
                "type": "paragraph",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left"
                },
                "content": [],
                "children": []
            },
            {
                "id": "06068de8-3399-47e9-b4b9-11b48303181d",
                "type": "paragraph",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left"
                },
                "content": [
                    {
                        "type": "text",
                        "text": "jules",
                        "styles": {}
                    }
                ],
                "children": []
            },
            {
                "id": "a36a58de-5ac7-4115-890b-b1d7f60c5d28",
                "type": "paragraph",
                "props": {
                    "textColor": "default",
                    "backgroundColor": "default",
                    "textAlignment": "left"
                },
                "content": [],
                "children": []
            }
        ],
    });

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