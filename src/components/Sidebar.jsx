import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaEdit } from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const navigate = useNavigate();
  const contextMenuRef = useRef(null);

  useEffect(() => {
    const storedBlogs = Object.keys(localStorage).map((key) => ({
      id: key,
      content: localStorage.getItem(key),
    }));
    setBlogs(storedBlogs);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setContextMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenuRef]);

  const handleDelete = (id) => {
    localStorage.removeItem(id);
    setBlogs(blogs.filter((blog) => blog.id !== id));
    setContextMenu(null);
  };

  const handleRename = (id) => {
    const newTitle = prompt("Entrez le nouveau titre :");
    if (newTitle) {
      const content = localStorage.getItem(id);
      const updatedContent = `${newTitle}\n${content.split('\n').slice(1).join('\n')}`;
      localStorage.setItem(id, updatedContent);
      setBlogs(blogs.map((blog) => (blog.id === id ? { ...blog, content: updatedContent } : blog)));
    }
    setContextMenu(null);
  };

  const handleNewArticle = () => {
    navigate("/");
  };

  const handleContextMenu = (event, id) => {
    event.preventDefault();
    setContextMenu({ id, x: event.clientX, y: event.clientY });
  };

  return (
    <div className={`fixed top-0 left-0 h-full bg-[#171717] text-white ${isOpen ? "w-64" : "w-16"} transition-width duration-300`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 focus:outline-none absolute top-0 right-0 mt-4 mr-4 bg-[#212121] hover:bg-[#363636] rounded"
      >
        {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>
      {isOpen && (
        <div className="p-4 flex flex-col h-full">
          <button
            onClick={handleNewArticle}
            className="mb-4 p-2 bg-[#212121] text-white rounded hover:bg-[#363636] w-fit"
          >
            <FaEdit />
          </button>
          <ul className="flex-grow">
            {blogs.map((blog) => (
              <li key={blog.id} className="mb-2 flex justify-between items-center relative">
                <Link to={`/blog/${blog.id}`} className="text-white hover:underline flex-1">
                  {blog.content.split('\n')[0] || blog.id}
                </Link>
                <button
                  onClick={(event) => handleContextMenu(event, blog.id)}
                  className="text-gray-500 hover:text-gray-700 ml-2"
                >
                  &#x22EE;
                </button>
                {contextMenu && contextMenu.id === blog.id && (
                  <div
                    ref={contextMenuRef}
                    className="absolute bg-[#2f2f2f] text-white rounded shadow-md z-10 p-2"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                  >
                    <button
                      onClick={() => handleRename(blog.id)}
                      className="block px-4 py-2 hover:bg-[#4d4d4d] w-full text-left rounded-md"
                    >
                      Renommer
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="block px-4 py-2 hover:bg-[#4d4d4d] w-full text-left rounded-md"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="absolute bottom-4">
            <div className="mt-4">
              <Link to="https://www.markdownguide.org/basic-syntax/" className="text-white hover:underline">
                Documentation Markdown
              </Link>
            </div>
            <div className="mt-2">
              <Link to="/chatbot" className="text-white hover:underline">
                Chatbot IA
              </Link>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default Sidebar;