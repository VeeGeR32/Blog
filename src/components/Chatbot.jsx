import React from "react";

const Chatbot = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Chatbot IA</h1>
        <iframe src="https://www.deepseekv3.com/embed" width="100%" height="600px" frameborder="0"></iframe>
      </div>
    </div>
  );
};

export default Chatbot;