import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { FaDownload, FaPlay, FaPause, FaStop } from "react-icons/fa";
import ShareButton from "./ShareButton";
import { cleanMarkdownTitle } from "../utils/markdownUtils";

const BlogView = () => {
  const { id } = useParams();
  const content = localStorage.getItem(id);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = synthRef.current.getVoices().filter(voice => voice.lang.startsWith('fr'));
      setVoices(voices);
      const savedVoiceName = localStorage.getItem('selectedVoice');
      const savedVoice = voices.find(voice => voice.name === savedVoiceName);
      setSelectedVoice(savedVoice || voices[0]);
    };

    loadVoices();
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    const savedRate = localStorage.getItem('rate');
    if (savedRate) {
      setRate(parseFloat(savedRate));
    }
  }, []);

  useEffect(() => {
    if (selectedVoice) {
      localStorage.setItem('selectedVoice', selectedVoice.name);
    }
  }, [selectedVoice]);

  useEffect(() => {
    localStorage.setItem('rate', rate);
  }, [rate]);

  const handlePlay = () => {
    if (utteranceRef.current) {
      synthRef.current.resume();
    } else {
      const plainTextContent = content.replace(/[#_*`~>-]/g, '');
      const utterance = new SpeechSynthesisUtterance(plainTextContent);
      utterance.voice = selectedVoice;
      utterance.rate = rate;
      utterance.onend = () => {
        setIsPlaying(false);
        utteranceRef.current = null;
      };
      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    synthRef.current.pause();
    setIsPlaying(false);
  };

  const handleStop = () => {
    synthRef.current.cancel();
    utteranceRef.current = null;
    setIsPlaying(false);
  };

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
        <div className="flex justify-center mb-4 space-x-2 items-center">
          <button
            onClick={exportPDF}
            className="p-2 h-fit bg-slate-900 text-white rounded hover:bg-slate-700"
          >
            <FaDownload />
          </button>
          <ShareButton content={content} blogId={id} />
          
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            className="p-2 bg-slate-900 text-white rounded hover:bg-slate-700"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button
            onClick={handleStop}
            className="p-2 bg-slate-900 text-white rounded hover:bg-slate-700"
          >
            <FaStop />
          </button>
          <select
            value={selectedVoice ? selectedVoice.name : ""}
            onChange={(e) => setSelectedVoice(voices.find((voice) => voice.name === e.target.value))}
            className="p-[5px] bg-slate-900 text-white rounded"
          >
            {voices
              .filter((voice) => !voice.name.toLowerCase().includes("google français"))
              .map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name.replace("Microsoft ", "").split(' ')[0]}
                </option>
              ))}
          </select>
          <select
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="p-1 bg-slate-900 text-white rounded"
          >
            {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
              <option key={speed} value={speed}>
                {`x${speed}`}
              </option>
            ))}
          </select>
        </div>
        <div id="blog-content" className="prose max-w-none bg-[#ffffff] text-black">
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
      </div>
    </div>
  );
};

export default BlogView;