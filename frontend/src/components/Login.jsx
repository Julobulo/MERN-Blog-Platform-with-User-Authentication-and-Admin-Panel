
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Login = ({ onSignupLinkClick, popup = false }) => {
    useEffect(() => {
        if (!popup) {
            document.title = `${import.meta.env.VITE_BLOG_NAME} - Login`;
        }
    }, []);
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
                `${import.meta.env.VITE_API_BASE_URL}/login`,
                {
                    ...inputValue,
                },
                { withCredentials: true }
            );
            console.log(data);
            const { success, message, isAdmin, isSuperAdmin } = data;
            if (success) {
                toast.success(message, { position: "bottom-left", });
                if (isAdmin || isSuperAdmin) toast.success(`You're logged in as ${isSuperAdmin ? 'Super Administrator' : 'Administrator'}!`, { position: "bottom-left", });
                localStorage.setItem('isAdmin', isAdmin);
                navigate("/");
            } else {
                toast.error(message, { position: "bottom-left", });
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
    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth/google`;
        // axios.get(`${import.meta.env.VITE_API_BASE_URL}/oauth/google`, { withCredentials: true, maxRedirects: 50 })
        //     .then((response) => {
        //         toast.success("axios.get to oauth/google worked");
        //     })
        //     .catch((error) => {
        //         toast.error(`daaang there was an error: ${error}`);
        //     })
    };
    return (
        <div className={`flex items-center ${!popup ? 'min-h-screen' : ''} justify-center`}>
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
                <div className="flex items-center my-2 mx-2">
                    <hr className="flex-grow border-t border-gray-700" />
                    <span className="px-2 text-gray-400">or</span>
                    <hr className="flex-grow border-t border-gray-700" />
                </div>
                <button onClick={handleGoogleLogin} className="w-full bg-gray-700 text-gray-300 py-2 px-4 rounded-md shadow-md hover:bg-gray-600 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#4285F4" d="M24 9.5c3.27 0 5.97 1.17 8.22 3.07l6.14-6.14C34.79 3.36 29.73 1 24 1 14.56 1 6.67 6.58 3.34 14.28l7.28 5.64C12.6 14.09 17.88 9.5 24 9.5z" /><path fill="#34A853" d="M46.55 24.27c0-1.38-.12-2.74-.33-4.05H24v8.28h12.78c-.55 2.95-2.12 5.45-4.48 7.14l6.93 5.37c4.07-3.76 6.32-9.29 6.32-15.74z" /><path fill="#FBBC05" d="M10.44 29.12a15.56 15.56 0 01-.87-5.13c0-1.78.31-3.5.87-5.13l-7.28-5.64A23.912 23.912 0 001 24c0 3.83.89 7.45 2.46 10.65l7.28-5.53z" /><path fill="#EA4335" d="M24 46c5.73 0 10.55-1.9 14.07-5.15l-6.93-5.37c-1.95 1.31-4.4 2.09-7.14 2.09-6.13 0-11.34-4.14-13.19-9.67l-7.28 5.53C6.67 41.42 14.56 46 24 46z" /><path fill="none" d="M1 1h46v46H1z" /></svg>
                    <span>Login with Google</span>
                </button>
                <hr className="my-6 border-t border-gray-700" />
                <span className="block text-sm text-center mt-4 text-gray-300">
                    Don't have an account? {popup ?
                        (<button onClick={onSignupLinkClick} className="text-green-400 hover:underline">Signup</button>) :
                        (<Link to="/signup" className="text-green-400 hover:underline">Signup</Link>)
                    }
                </span>
            </div>
        </div>
    )
}

export default Login
