import React, { useEffect } from 'react';
import CreateForm from './CreateForm';


const Create = () => {
    useEffect(() => {
        document.title = `New Post`;
    }, []);
    return (
        CreateForm({ pageTitle: 'Create' })
    )
}


export default Create;
