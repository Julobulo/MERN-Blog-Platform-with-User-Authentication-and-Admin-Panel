
import React from "react";
import {Routes, Route} from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import Article from "./components/Article";
import Create from "./components/Create";
import Explore from "./components/Explore";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";

const App = () => {
  return (
    <main>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AdminPanel" element={<AdminPanel />} />
        <Route path="/blog/article/:id" element={<Article />} />
        <Route path="/create" element={<Create />} />
        <Route path="/blog" element={<Explore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Footer />
    </main>
  )
}

export default App
