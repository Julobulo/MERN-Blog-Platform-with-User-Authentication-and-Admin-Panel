import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const Create = () => {
    const [image, setImage] = useState('');  // New state for image URL
    const [title, setTitle] = useState('The Future of Quantum Computing');
    const [subtitle, setSubtitle] = useState('Exploring the potential and challenges of quantum technology.');
    const [tags, setTags] = useState(['Quantum Computing', 'Technology', 'Innovation', 'Future']);
    const [mainContent, setMainContent] = useState(`
    <h1>The Future of Quantum Computing</h1>
    <h2>Introduction</h2>
    <p><strong>Quantum computing</strong> represents a paradigm shift in the way we process information. Unlike classical computers, which use bits as the smallest unit of data, quantum computers use quantum bits or <em>qubits</em>. These qubits can exist in multiple states simultaneously, thanks to the principles of <u>superposition</u> and <u>entanglement</u>.</p>
    
    <blockquote>
        <p>One of the most significant potential applications of quantum computing is in the field of cryptography. Quantum algorithms, such as <strong>Shor's algorithm</strong>, could potentially break many of the cryptographic systems currently in use. This has profound implications for data security and privacy.</p>
    </blockquote>

    <h2>Challenges and Solutions</h2>
    <p>However, there are substantial challenges to overcome before quantum computing can become mainstream:</p>
    <ul>
        <li>Maintaining qubit stability (<em>decoherence</em>)</li>
        <li>Error correction</li>
        <li>Scaling up the number of qubits in a single system</li>
    </ul>
    <p>Researchers are actively exploring various approaches, such as <strong>topological qubits</strong> and quantum error correction codes, to address these issues.</p>

    <h3>Maintaining Qubit Stability</h3>
    <p>Decoherence is one of the most significant challenges in quantum computing. It refers to the loss of quantum coherence, which can result in errors. To combat this, scientists are developing <mark>quantum error correction</mark> techniques and exploring different materials for building stable qubits.</p>

    <h3>Scaling Up</h3>
    <p>Scaling up quantum systems to have more qubits is crucial for practical applications. This involves not only increasing the number of qubits but also ensuring they can interact effectively. <a href="https://quantum-computing.ibm.com">IBM's quantum computing platform</a> is one example of ongoing efforts to build scalable quantum systems.</p>

    <h2>Applications of Quantum Computing</h2>
    <p>The future of quantum computing holds promise for solving complex problems that are currently intractable for classical computers. This includes applications in:</p>
    <ol>
        <li>Drug discovery</li>
        <li>Optimization problems</li>
        <li>Material science</li>
    </ol>

    <h3>Drug Discovery</h3>
    <p>Quantum computers can simulate molecular interactions at a level of detail that classical computers cannot, potentially leading to breakthroughs in <strong>drug discovery</strong> and personalized medicine.</p>

    <h3>Optimization Problems</h3>
    <p>Many real-world problems, such as optimizing supply chains and financial portfolios, can be modeled as optimization problems. Quantum algorithms have the potential to find optimal solutions much faster than classical algorithms.</p>

    <h3>Material Science</h3>
    <p>By simulating the properties of new materials at the quantum level, researchers can discover new materials with desirable properties for use in technology and industry.</p>

    <h2>Conclusion</h2>
    <p>As the technology matures, <em>quantum computing</em> could revolutionize industries and drive significant advancements in science and technology. The journey is fraught with challenges, but the potential rewards make it a field of immense interest and investment.</p>

    <p><strong>The future of quantum computing is not just a possibility; it's an inevitability. </strong> Researchers, engineers, and technologists around the world are working tirelessly to bring this revolutionary technology to fruition.</p>
    
    <p style="text-align: center;"><img src="https://via.placeholder.com/400" alt="Quantum Computing" /></p>
    <p style="text-align: right;">- John Doe</p>
`);
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
                <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
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
                    Post
                </button>
            </div>
        </div>
    );
};

export default Create;
