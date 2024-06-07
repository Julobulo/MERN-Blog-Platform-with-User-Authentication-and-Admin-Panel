import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';

const AdminPanel = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/AdminPanel/Articles");
    }, [navigate]);
}

export default AdminPanel;
