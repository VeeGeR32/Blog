import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FaExternalLinkAlt } from "react-icons/fa";

const ShareButton = ({ content, blogId }) => {
  const [shareLink, setShareLink] = useState("");

  const handleShare = () => {
    const id = blogId || uuidv4();
    localStorage.setItem(id, content);
    const link = `${window.location.origin}/blog/${id}`;
    setShareLink(link);
  };

  return (
    <div className="">
      <button
        onClick={handleShare}
        className="px-2 py-2 bg-slate-900 text-white rounded hover:bg-slate-700"
      >
        <FaExternalLinkAlt />
      </button>
      {shareLink && (
        <div className="mt-2">
          <input
            type="text"
            value={shareLink}
            readOnly
            className="w-full p-2 border rounded"
            onClick={(e) => e.target.select()}
          />
          <p className="text-sm text-gray-500 mt-1">
            Copiez ce lien pour partager votre blog.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShareButton;