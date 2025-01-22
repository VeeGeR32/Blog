import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EditorPreview from "./components/EditorPreview";
import ShareButton from "./components/ShareButton";
import BlogView from "./components/BlogView";
import Sidebar from "./components/Sidebar";
import Chatbot from "./components/Chatbot";

const App = () => {
  const [content, setContent] = useState("");

  return (
    <Router>
      <div className="flex ">
        <Sidebar />
        <div className="flex-1 min-h-screen bg-[#212121] p-8 ml-16">
          <Routes>
            <Route
              path="/"
              element={
                <div className="max-w-4xl mx-auto">
                  <EditorPreview content={content} onContentChange={setContent} />
                  <ShareButton content={content} />
                </div>
              }
            />
            <Route path="/blog/:id" element={<BlogView />} />
            <Route path="/chatbot" element={<Chatbot />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;