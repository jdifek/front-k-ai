import { ArrowUp, Square } from "lucide-react";

interface InputAreaProps {
  stopPrinting: () => void;
  isPrinting: boolean; // ⬅️ Добавили isTyping
  messages: {
    role: string;
    content: string;
  }[];
  input: string;
  setinput: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessageWithStream: (userMessage: string) => Promise<void>;
}

export const InputArea = ({
  messages,
  stopPrinting,
  input,
  isPrinting,
  setinput,
  handleSendMessageWithStream,
}: InputAreaProps) => {
  return (
    <div
      className={`w-full max-w-3xl px-4 ${
        messages.length !== 0
          ? "fixed bottom-12 left-1/2 -translate-x-1/2"
          : "w-full max-w-3xl mx-auto px-4"
      }`}
    >
      <div className="relative">
        <input
          type="text"
          placeholder="How can I help you today?"
          value={input}
          onChange={(e) => setinput(e.target.value)}
          className="w-full p-3 md:p-4 pr-12 rounded-lg bg-[#1F1F1F] dark:bg-[#2F2F2F] border border-gray-700 focus:outline-none focus:border-[#7C3AED] text-gray-200 placeholder-gray-400"
        />
        <button
          onClick={() => {
            if (input.length > 0) handleSendMessageWithStream(input);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-[#7C3AED] rounded-lg hover:bg-[#6D28D9]"
        >
          {isPrinting ? (
            <Square
              onClick={() => {
                if (isPrinting) {
                  stopPrinting();
                } else if (input.length > 0) {
                  handleSendMessageWithStream(input);
                }
              }}
              size={20}
            />
          ) : (
            <ArrowUp onClick={() => setinput("")} size={20} />
          )}{" "}
          {/* ⬅️ Меняем иконку */}
        </button>
      </div>

      {/* Action Buttons */}
      {/* <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-4">
      <button className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-[#1F1F1F] dark:bg-[#2F2F2F] hover:bg-gray-800 text-gray-300 text-sm">
        <Image size={18} />
        <span className="hidden md:inline">Create image</span>
      </button>
      <button className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-[#1F1F1F] dark:bg-[#2F2F2F] hover:bg-gray-800 text-gray-300 text-sm">
        <Code size={18} />
        <span className="hidden md:inline">Code</span>
      </button>
      <button className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-[#1F1F1F] dark:bg-[#2F2F2F] hover:bg-gray-800 text-gray-300 text-sm">
        <Lightbulb size={18} />
        <span className="hidden md:inline">Make a plan</span>
      </button>
      <button className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-[#1F1F1F] dark:bg-[#2F2F2F] hover:bg-gray-800 text-gray-300 text-sm">
        <Link size={18} />
        <span className="hidden md:inline">News</span>
      </button>
      <button className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-[#1F1F1F] dark:bg-[#2F2F2F] hover:bg-gray-800 text-gray-300 text-sm">
        <MoreHorizontal size={18} />
        <span className="hidden md:inline">More</span>
      </button>
    </div> */}
    </div>
  );
};
