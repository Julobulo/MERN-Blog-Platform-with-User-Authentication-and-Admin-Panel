import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const domainName = import.meta.env.VITE_API_BASE_URL;

const Footer = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  useEffect(() => {
    axios.get(`${domainName}/blog/3-latest`)
      .then((response) => {
        setLatestPosts(response.data)
      })
      .catch((error) => {
        toast.error(error);
        console.error(error);
      })
  }, [])
  return (
    <footer className="bg-gray-900 py-6">
      <div className="container mx-auto px-4 flex flex-col justify-between">
        <div className="sm:my-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-lg font-semibold mb-2 text-gray-200">About Us</h2>
              <p className="text-gray-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis odio vitae purus commodo lacinia.
              </p>
            </div>
            {latestPosts.length > 0 && <div className="mb-4 sm:mb-0">
              <h2 className="text-lg font-semibold mb-2 text-gray-200">Latest Posts</h2>
              <ul>
                {latestPosts.map((post, index) => (
                  <div className="my-2">
                    <li key={index} className="my-2">
                      <a href={`/blog/article/${post.title}`} className="text-gray-400 hover:text-gray-200">{post.title}</a>
                    </li>
                    {
                      (index < latestPosts.length - 1) ?
                        (<hr className="my-2" />) : (<></>)
                    }
                  </div>
                ))}
              </ul>
            </div>}
            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-200">Contact Us</h2>
              <p className="text-gray-400">Email: info@example.com</p>
              <p className="text-gray-400">Phone: +1234567890</p>
            </div>
          </div>
        </div>
        <div className="text-center mt-auto sm:my-5">
          <p className="text-gray-400">&copy; 2024 {import.meta.env.VITE_BLOG_NAME}. All rights reserved.</p>
          <p className="text-gray-400">Powered by <a
            href="https://jules.tf"
            target="_blank"
            rel="noopener noreferrer"
          >
            jules.tf
          </a>.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
