import React, { useEffect, useState } from 'react';
import CreateForm from '../CreateForm';
import Spinner from '../Spinner';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ArticleEdit = () => {
    const { title } = useParams();
    const [loading, setLoading] = useState(true);
    const [articleData, setArticleData] = useState({});
    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:5555/blog/article/${title}`,
            { withCredentials: true })
            .then((response) => {
                setArticleData(response.data);
                const article = response.data;
                const { image: _, ...articleWithoutImage } = article; // Destructure to remove the "image" field
                console.log(`Here's the article data gotten: ${JSON.stringify(articleWithoutImage)}`);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
            })
        console.log(`Article data after axios: ${JSON.stringify(articleData)}`)
    }, []);
    if (loading || !articleData) {
        return <div className="flex-grow bg-black p-12 text-white">
            <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                <Spinner />
            </div>
        </div>
    }
    return (
        <CreateForm
            pageTitle={'Edit'}
            articleData={articleData}
        />
    );
};

export default ArticleEdit;
