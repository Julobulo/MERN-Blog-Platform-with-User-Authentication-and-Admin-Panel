
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
        email: "",
        password: "",
    });
    const { email, password } = inputValue;
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setInputValue({
            ...inputValue,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                "http://localhost:5555/login",
                {
                    ...inputValue,
                },
                { withCredentials: true }
            );
            console.log(data);
            const { success, message, isAdmin } = data;
            if (success) {
                toast.success(message, {position: "bottom-left",});
                if (isAdmin) toast.success("You're logged in as Administrator!", {position: "bottom-left",});
                localStorage.setItem('isAdmin', isAdmin);
                navigate("/");
            } else {
                toast.error(message, {position: "bottom-left",});
            }
        } catch (error) {
            toast.error(`Couldn't login`);
            console.log(error);
        }
        setInputValue({
            ...inputValue,
            email: "",
            password: "",
        });
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-green-400">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-green-400">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            placeholder="Enter your email"
                            onChange={handleOnChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm bg-gray-700 text-gray-300"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-green-400">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            placeholder="Enter your password"
                            onChange={handleOnChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm bg-gray-700 text-gray-300"
                        />
                    </div>
                    <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400">Login</button>
                </form>
                <hr className="my-4 border-t border-gray-700" />
                <span className="block text-sm text-center mt-4 text-gray-300">
                    Don't have an account? <Link to="/signup" className="text-green-400 hover:underline">Signup</Link>
                </span>
            </div>
        </div>
    )
}

export default Login
