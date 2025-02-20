import React from "react";
import {
  Menu,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type SidebarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chats: {
    id: number;
    createdAt: string;
    userId: null | number;
    sessionId: null | number;
  }[];
  isDarkMode: boolean;
  handleCreateChat: () => void;
  handleDeleteChat: (id: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  chats,
  isDarkMode,
  handleCreateChat,
  handleDeleteChat,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`sidebar ${
        isSidebarOpen ? "w-64 md:w-72" : "w-0"
      } transition-all duration-300 overflow-hidden flex flex-col border-r border-gray-800 fixed md:relative h-full z-30 ${
        isDarkMode ? "bg-[#0F0F0F]" : "bg-gray-100"
      }`}
    >
      <div className="p-4 flex items-center justify-between">
        <h1
          className={`text-xl font-medium ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          Chats
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleCreateChat}
            className="p-2 bg-[#7C3AED] rounded-lg hover:bg-[#6D28D9]"
          >
            <Plus size={20} />
          </button>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2  rounded-lg ${
              isDarkMode
                ? "text-white hover:bg-gray-800"
                : "text-black hover:bg-gray-200"
            }`}
          >
            {isSidebarOpen ? (
              <PanelLeftClose size={20} />
            ) : (
              <PanelLeftOpen size={20} />
            )}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => navigate(`/chat/${chat.id}`)}
            className={`flex items-center justify-between px-4 py-3 cursor-pointer ${
              isDarkMode
                ? "text-white hover:bg-gray-800"
                : "text-black hover:bg-gray-200"
            }`}
          >
            <div className=" flex items-center">
              <Menu
                size={20}
                className={`mr-2 ${
                  isDarkMode
                    ? "text-white hover:bg-gray-800"
                    : "text-black hover:bg-gray-200"
                }`}
              />
              <span className="mr-2">{chat.id}</span>
            </div>
            <Trash2
              onClick={() => handleDeleteChat(chat.id)}
              size={20}
              className={`mr-2 ${
                !isDarkMode ? "text-black" : "text-white"
              } hover:text-red-500`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
