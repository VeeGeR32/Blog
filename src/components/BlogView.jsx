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
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${id}.pdf`);
    });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-[#ffffff] p-8 rounded-lg shadow-sm">
        <div className="flex justify-end mb-4 space-x-2">
          <button
            onClick={exportPDF}
            className="p-2 bg-slate-900 text-white rounded hover:bg-slate-700"
          >
            <FaDownload />
          </button>
        </div>
        <div id="blog-content" className="prose max-w-none bg-[#ffffff] text-black">
          <h1 className="text-center text-4xl font-bold mb-8">Titre du Blog</h1>
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