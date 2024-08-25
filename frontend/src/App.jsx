
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Articles from "./components/AdminPanel components/Articles";
import Article from "./components/Article";
import ArticleEdit from "./components/AdminPanel components/ArticleEdit";
import ArticleDelete from "./components/AdminPanel components/ArticleDelete";
import Users from "./components/AdminPanel components/Users";
import UserEdit from "./components/AdminPanel components/UserEdit";
import UserDelete from "./components/AdminPanel components/UserDelete";
import Author from "./components/Author";
import Create from "./components/Create";
import Explore from "./components/Explore";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import ProfileEdit from "./components/ProfileEdit";
import Signup from "./components/Signup";
import UserPassword from "./components/AdminPanel components/UserPassword";

const App = () => {
  const faviconLink = import.meta.env.VITE_BLOG_LOGO;
  console.log(`faviconLink: ${faviconLink}`);
  var link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = faviconLink || '/default.png';
  return (
    <main className="bg-black min-h-screen flex flex-col justify-between">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition:Bounce
      />
      <Routes>
        <Route path="/" element={[<Navbar />, <Home />, <Footer />]} />
        <Route path="/AdminPanel/Articles" element={[<Navbar />, <Articles />, <Footer />]} />
        <Route path="/AdminPanel/Articles/Edit/:title" element={[<Navbar />, <ArticleEdit />, <Footer />]} />
        <Route path="/AdminPanel/Articles/Delete/:title" element={[<Navbar />, <ArticleDelete />, <Footer />]} />
        <Route path="/AdminPanel/Users" element={[<Navbar />, <Users />, <Footer />]} />
        <Route path="/AdminPanel/Users/Edit/:author" element={[<Navbar />, <UserEdit />, <Footer />]} />
        <Route path="/AdminPanel/Users/Password/:author" element={[<Navbar />, <UserPassword />, <Footer />]} />
        <Route path="/AdminPanel/Users/Delete/:author" element={[<Navbar />, <UserDelete />, <Footer />]} />
        <Route path="/author/:author" element={[<Navbar />, <Author />, <Footer />]} />
        <Route path="/blog/article/:title" element={[<Navbar />, <Article />, <Footer />]} />
        <Route path="/create" element={[<Navbar />, <Create />, <Footer />]} />
        <Route path="/blog" element={[<Navbar />, <Explore />, <Footer />]} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={[<Navbar />, <Profile />, <Footer />]} />
        <Route path="/profile/edit" element={[<Navbar />, <ProfileEdit />, <Footer />]} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </main>
  )
}

export default App
