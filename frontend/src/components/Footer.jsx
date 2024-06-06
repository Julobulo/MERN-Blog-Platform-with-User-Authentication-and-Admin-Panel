import React from "react";

const Footer = () => {
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
            <div className="mb-4 sm:mb-0">
              <h2 className="text-lg font-semibold mb-2 text-gray-200">Latest Posts</h2>
              <ul>
                <li>
                  <a href="#" className="text-gray-400 hover:text-gray-200">
                    Post 1
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-gray-200">
                    Post 2
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-gray-200">
                    Post 3
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-200">Contact Us</h2>
              <p className="text-gray-400">Email: info@example.com</p>
              <p className="text-gray-400">Phone: +1234567890</p>
            </div>
          </div>
        </div>
        <div className="text-center mt-auto sm:my-5">
          <p className="text-gray-400">&copy; 2024 Your Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
