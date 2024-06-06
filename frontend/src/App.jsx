
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AdminPanel from "./components/AdminPanel";
import Article from "./components/Article";
import Author from "./components/Author";
import Create from "./components/Create";
import Explore from "./components/Explore";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Signup from "./components/Signup";

const App = () => {
  return (
    <main>
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
        <Route path="/AdminPanel" element={[<Navbar />, <AdminPanel />, <Footer />]} />
        <Route path="/author/:author" element={[<Navbar />, <Author />, <Footer />]} />
        <Route path="/blog/article/:id" element={[<Navbar />, <Article />, <Footer />]} />
        <Route path="/create" element={[<Navbar />, <Create />, <Footer />]} />
        <Route path="/blog" element={[<Navbar />, <Explore />, <Footer />]} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={[<Navbar />, <Profile />, <Footer />]} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </main>
  )
}

export default App
