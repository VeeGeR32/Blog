import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaPenAlt, FaGlasses } from "react-icons/fa";

const EditorPreview = ({ content, onContentChange }) => {
  const [isRaw, setIsRaw] = useState(true);

  const handleChange = (e) => {
    const newContent = e.target.value;
    onContentChange(newContent);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-4">
        <button
          onClick={() => setIsRaw(!isRaw)}
          className="p-2 rounded bg-gray-200 hover:bg-gray-300 flex items-center"
        >
          {isRaw ? <FaPenAlt className="text-black" /> : <FaGlasses className="text-black" />}
        </button>
      </div>

      <div className="rounded-lg p-8 bg-[#ffffff] shadow-sm">
        {isRaw ? (
          <textarea
            value={content}
            onChange={handleChange}
            className="w-full h-96 p-2 font-mono resize-none focus:outline-none bg-[#ffffff] text-black"
          />
        ) : (
          <div className="prose max-w-none">
            <ReactMarkdown
              children={content}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      children={String(children).replace(/\n$/, "")}
                      style={darcula}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorPreview;