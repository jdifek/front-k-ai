import React, { useRef, useEffect, KeyboardEvent } from "react";
import { ArrowUp, Square } from "lucide-react";

interface InputAreaProps {
  stopPrinting: () => void;
  isPrinting: boolean;
  messages: {
    role: string;
    content: string;
  }[];
  input: string;
  setinput: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessageWithStream: (userMessage: string) => Promise<void>;
  isDarkMode: boolean;
}

export const InputArea = ({
  messages,
  isDarkMode,
  stopPrinting,
  input,
  isPrinting,
  setinput,
  handleSendMessageWithStream,
}: InputAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle automatic resize of the textarea
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = "0";

      // Set a maximum height (adjust the value as needed)
      const maxHeight = 200;
      const scrollHeight = textareaRef.current.scrollHeight;

      // Apply the new height, but cap it at maxHeight
      textareaRef.current.style.height = `${Math.min(
        scrollHeight,
        maxHeight
      )}px`;

      // Only show scrollbar when content exceeds maxHeight
      textareaRef.current.style.overflowY =
        scrollHeight > maxHeight ? "auto" : "hidden";
    }
  }, [input]);

  // Handle key press events (Enter and Shift+Enter)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Shift+Enter: Just let the default behavior happen (new line)
        return;
      } else {
        // Enter without shift: Send message
        e.preventDefault();
        if (input.trim().length > 0) {
          handleSendMessageWithStream(input);
          setinput("");
        }
      }
    }
  };

  // Function to handle button click
  const handleButtonClick = () => {
    if (isPrinting) {
      stopPrinting();
    } else if (input.trim().length > 0) {
      handleSendMessageWithStream(input);
      setinput("");
    }
  };

  return (
    <div
      className={`w-full max-w-3xl px-4 ${
        messages.length !== 0
          ? "fixed bottom-12 left-1/2 -translate-x-1/2"
          : "w-full max-w-3xl mx-auto px-4"
      }`}
    >
      <div className="relative">
        <textarea
          ref={textareaRef}
          placeholder="How can I help you today?"
          value={input}
          onChange={(e) => setinput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className={`w-full p-3 md:p-4 pr-12 rounded-lg focus:outline-none focus:border-[#7C3AED] placeholder-gray-400 resize-none ${
            isDarkMode ? "bg-[#1F1F1F] text-gray-200" : "bg-white text-black"
          }`}
          style={{
            minHeight: "48px",
            maxHeight: "200px",
          }}
        />
        <button
          onClick={handleButtonClick}
          className="absolute right-4 top-[45%] transform -translate-y-1/2 p-2 bg-[#7C3AED] rounded-lg hover:bg-[#6D28D9]"
        >
          {isPrinting ? <Square size={20} /> : <ArrowUp size={20} />}
        </button>
      </div>
    </div>
  );
};
