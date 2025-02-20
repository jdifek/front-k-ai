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
      className={`flex-1 overflow-y-auto flex flex-col justify-center ${
        isSidebarOpen ? "p-10" : "p-10 px-[6rem]"
      } mx-auto w-full relative`}
      style={{ paddingBottom: "150px", minHeight: "calc(100vh - 80px)" }}
    >
      {messages.length === 0 && (
        <h1
          className={`text-3xl md:text-4xl font-bold mb-8 text-center px-4 ${
            !isDarkMode ? "text-gray-700" : "text-white"
          }`}
        >
          Ask Fary, Know More.
        </h1>
      )}
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div className="p-3 rounded-lg bg-gray-700 text-white max-w-xs">
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
                      {children as string}
                    </code>
                  );
                },
              }}
            >
              {msg.content || ""}
            </ReactMarkdown>
          </div>
        </div>
      ))}

      {/* Input Area */}
      <InputArea
        messages={messages}
        input={input}
        setinput={setinput}
        isPrinting={isPrinting} // ⬅️ Передаем состояние
        stopPrinting={stopPrinting} // ⬅️ Передаем состояние

        handleSendMessageWithStream={handleSendMessageWithStream}
      />
    </div>
  );
};

export default ChatArea;
