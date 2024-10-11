import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineExplore } from "react-icons/md";
import { MdOutlinePostAdd } from "react-icons/md";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { SlLogin } from "react-icons/sl";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import Modal from './Modal';
import Login from './Login';
import Signup from './Signup';

const NavigationBar = () => {
    const tokenExists = Cookies.get('token');
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const handleSignupLinkClick = () => {
        setIsLoginOpen(false);
        setIsSignupOpen(true);
    };
    const handleLoginLinkClick = () => {
        setIsLoginOpen(true);
        setIsSignupOpen(false);
    };

    return (
        <nav className="bg-gray-900 shadow-md">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                <Link to="/" className="flex items-center" key={"home"}>
                    <img src={import.meta.env.VITE_BLOG_LOGO} alt="Logo" className="mr-3 hidden sm:block" />
                    <span className="text-2xl font-bold text-green-400">{import.meta.env.VITE_BLOG_NAME}</span>
                </Link>
                <div className="hidden lg:flex space-x-6 flex-grow justify-end">
                    <Link to="/blog" className="btn btn-ghost text-green-400" key={"explore"}><MdOutlineExplore className='inline align-middle' /> <span className='align-middle'>Explore</span></Link>
                    {Cookies.get('token') ? (<>
                        <Link to="/create" className="btn btn-ghost text-green-400" key={"new post"}><MdOutlinePostAdd className='inline align-middle' /> <span className='align-middle'>New Post</span></Link>
                        <Link to="/profile" className="btn btn-ghost text-green-400" key={"profile"}><CgProfile className='inline align-middle' /> <span className='align-middle'>Profile</span></Link>
                        {Cookies.get('isAdmin') === "true" ? (<Link to="/AdminPanel/Articles" className="btn btn-ghost text-green-400" key={"admin panel"}><MdOutlineAdminPanelSettings className='inline align-middle' /> <span className='align-middle'>Admin Panel</span></Link>) : null}
                        <button className="btn btn-ghost text-green-400" onClick={() => { toast.success(`token: ${Cookies.get('token')}`); Cookies.remove('token', { path: '/', domain: '.blog.jules.tf' }); console.log('removing cookie token with path / and domain .blog.jules.tf'); localStorage.clear(); navigate('/'); toast.success('Successfully logged out!', { position: 'bottom-right' }) }} key={"logout"}><MdOutlineAdminPanelSettings className='inline align-middle' /> <span className='align-middle'>Logout</span></button>
                    </>) :
                        <button onClick={() => setIsLoginOpen(true)} className="btn btn-ghost text-green-400" key={"login"}><SlLogin className='inline align-middle' /> <span className='align-middle'>Login</span></button>
                    }
                </div>
                <div className="lg:hidden">
                    <button
                        onClick={toggleMenu}
                        className="text-green-400 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                        </svg>
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="lg:hidden sm:items-center sm:flex sm:flex-col bg-gray-900 shadow-md">
                    <div className="flex flex-col items-center px-2 pt-2 pb-3 space-y-1">
                        <Link to="/blog" className="btn btn-ghost text-green-400 flex items-center" onClick={toggleMenu} key={"explore"}>
                            <MdOutlineExplore className='inline align-middle' />
                            <span className='align-middle ml-2'>Explore</span>
                        </Link>
                        {Cookies.get('token') ? (
                            <div className='flex flex-col items-center px-2 pt-2 pb-3 space-y-1'>
                                <Link to="/create" className="btn btn-ghost text-green-400 flex items-center" onClick={toggleMenu} key={"new post"}>
                                    <MdOutlinePostAdd className='inline align-middle' />
                                    <span className='align-middle ml-2'>New Post</span>
                                </Link>
                                <Link to="/profile" className="btn btn-ghost text-green-400 flex items-center" onClick={toggleMenu} key={"profile"}>
                                    <CgProfile className='inline align-middle' />
                                    <span className='align-middle ml-2'>Profile</span>
                                </Link>
                                {Cookies.get('isAdmin') === "true" && (
                                    <Link to="/AdminPanel/Articles" className="btn btn-ghost text-green-400 flex items-center" onClick={toggleMenu} key={"admin panel"}>
                                        <MdOutlineAdminPanelSettings className='inline align-middle' />
                                        <span className='align-middle ml-2'>Admin Panel</span>
                                    </Link>
                                )}
                                <button
                                    className="btn btn-ghost text-green-400 flex items-center"
                                    onClick={() => {
                                        toast.success(`token: ${Cookies.get('token')}`);
                                        // Cookies.set('token', '');
                                        localStorage.clear();
                                        navigate('/');
                                        toast.success('Successfully logged out!', { position: 'bottom-right' });
                                        toggleMenu();
                                    }}
                                    key={"logout"}
                                >
                                    <MdOutlineAdminPanelSettings className='inline align-middle' />
                                    <span className='align-middle ml-2'>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-ghost text-green-400 flex items-center" key={"login"}>
                                <SlLogin className='inline align-middle' />
                                <span className='align-middle ml-2'>Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            )}
            <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} key={"signup modal"}>
                <Login onSignupLinkClick={handleSignupLinkClick} popup={true} />
            </Modal>

            <Modal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} key={"login modal"}>
                <Signup onLoginLinkClick={handleLoginLinkClick} popup={true} />
            </Modal>
        </nav>
    );
};

export default NavigationBar;
