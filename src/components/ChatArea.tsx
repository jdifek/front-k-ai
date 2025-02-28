import React from "react";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SyntaxHighlighter from "react-syntax-highlighter";
import { InputArea } from "./InputArea";

type MainContentProps = {
  isSidebarOpen: boolean;
  isDarkMode: boolean;
  messages: { role: string; content: string }[];
  input: string;
  isPrinting: boolean;
  stopPrinting: () => void;
  setinput: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessageWithStream: (userMessage: string) => Promise<void>;
};

const ChatArea: React.FC<MainContentProps> = ({
  isSidebarOpen,
  isDarkMode,
  messages,
  input,
  stopPrinting,
  isPrinting,
  setinput,
  handleSendMessageWithStream,
}) => {
  return (
    <div
      className={`flex-1 overflow-y-auto flex flex-col justify-center md:p-6 p-4 ${
        isSidebarOpen ? "lg:px-10" : "lg:px-[6rem]"
      } mx-auto w-full relative`}
      style={{ paddingBottom: "150px", minHeight: "calc(100vh - 80px)" }}
    >
      {messages.length === 0 && (
        <h1
          className={`text-3xl md:text-4xl font-bold mb-8 text-center ${
            !isDarkMode ? "text-gray-700" : "text-white"
          }`}
        >
          Ask Fary, Know More.
        </h1>
      )}

      {messages.map((msg, index) => {
        console.log(msg);
        return (
          <div
            key={index}
            className={`flex mb-2 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-[85%] md:max-w-xs ${
                isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={materialDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {msg.content || ""}
              </ReactMarkdown>
            </div>
          </div>
        );
      })}

      {/* Input Area */}
      <InputArea
        messages={messages}
        input={input}
        setinput={setinput}
        isPrinting={isPrinting}
        stopPrinting={stopPrinting}
        handleSendMessageWithStream={handleSendMessageWithStream}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default ChatArea;
