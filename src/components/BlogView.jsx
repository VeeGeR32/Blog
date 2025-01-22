import React from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { FaDownload } from "react-icons/fa";
import ShareButton from "./ShareButton";

const BlogView = () => {
  const { id } = useParams();
  const content = localStorage.getItem(id);

  if (!content) {
    return <div className="text-center mt-8">Blog non trouvé.</div>;
  }

  const exportPDF = () => {
    const input = document.getElementById("blog-content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${id}.pdf`);
    });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-[#2f2f2f] p-6 rounded-lg shadow-sm">
        <div className="flex justify-end mb-4 space-x-2">
          <button
            onClick={exportPDF}
            className="px-2 py-2 bg-white text-black rounded hover:bg-slate-200"
          >
            <FaDownload />
          </button>
        </div>
        <div id="blog-content" className="prose max-w-none bg-[#2f2f2f] text-white">
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
        <ShareButton content={content} blogId={id} />
      </div>
    </div>
  );
};

export default BlogView;