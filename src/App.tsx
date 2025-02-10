import { useState, useEffect } from "react";
import { FaGoogle, FaVk } from "react-icons/fa";
import {
  Menu,
  Plus,
  ChevronDown,
  Image,
  Code,
  Lightbulb,
  Link,
  MoreHorizontal,
  ArrowUp,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Mail,
  Lock,
} from "lucide-react";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState("Fary3.0-Max");
  const [chats, setChats] = useState([
    { id: 1, name: "Чат 1" },
    { id: 2, name: "Чат 2" },
  ]);
  const [isDarkMode, setIsDarkMode] = useState(true); // Dark mode state

  const versions = ["Fary3.0-Max", "Fary3.5-Ultra", "Fary2.4-Base"];

  const addNewChat = () => {
    const newChat = {
      id: chats.length + 1,
      name: `Чат ${chats.length + 1}`,
    };
    setChats([...chats, newChat]);
  };

  const handleVersionSelect = (version: string) => {
    setSelectedVersion(version);
    setIsVersionDropdownOpen(false);
  };

  // Toggle Dark/Light Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const closeSidebarOnClickOutside = (e: React.MouseEvent) => {
    // Check if the screen size is mobile (width <= 768px)
    if (
      window.innerWidth <= 768 &&
      isSidebarOpen &&
      !e.target.closest(".sidebar")
    ) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div
      className={`flex h-screen transition-colors duration-500 ${
        isDarkMode ? "bg-[#0F0F0F]" : "bg-gray-100"
      } text-white dark:text-white`}
      onClick={closeSidebarOnClickOutside}
    >
      {/* Sidebar */}
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
            Чаты
          </h1>
          <div className="flex gap-2">
            <button
              onClick={addNewChat}
              className="p-2 bg-[#7C3AED] rounded-lg hover:bg-[#6D28D9]"
            >
              <Plus size={20} />
            </button>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 hover:bg-gray-800 rounded-lg ${
                isDarkMode ? "text-white" : "text-black"
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
              className={`flex items-center px-4 py-3 hover:bg-gray-800 cursor-pointer ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              <Menu size={20} className="mr-2 text-gray-400" />
              <span>{chat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 hover:bg-gray-800 rounded-lg ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {!isSidebarOpen && <PanelLeftOpen size={20} />}
            </button>
            <span className="text-[#7C3AED] text-xl">✨</span>
            <button
              onClick={() => setIsVersionDropdownOpen(!isVersionDropdownOpen)}
              className="flex items-center gap-2 hover:bg-gray-800 px-2 py-1 rounded-lg max-w-[140px] md:max-w-none overflow-hidden text-ellipsis whitespace-nowrap"
            >
              <span
                className={`text-gray-200 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                {selectedVersion}
              </span>
              <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
            </button>

            {/* Version Dropdown */}
            {isVersionDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#1F1F1F] rounded-lg shadow-lg border border-gray-800 py-1 z-30">
                {versions.map((version) => (
                  <button
                    key={version}
                    onClick={() => handleVersionSelect(version)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-800 text-gray-300"
                  >
                    {version}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2 md:gap-3">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-3 md:px-4 py-2 bg-[#7C3AED] rounded-lg hover:bg-[#6D28D9] text-sm font-medium whitespace-nowrap"
            >
              Войти
            </button>
            <button
              onClick={toggleDarkMode}
              className="px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-400"
            >
              {isDarkMode ? "🌞" : "🌙"}
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col justify-center p-4 max-w-[1200px] mx-auto w-full">
          <h1
            className={`text-3xl md:text-4xl font-bold mb-8 text-center px-4 ${
              !isDarkMode ? "text-black" : "text-white"
            }`}
          >
            Ask Fary, Know More.
          </h1>

          {/* Input Area */}
          <div className="w-full max-w-3xl mx-auto px-4">
            <div className="relative">
              <input
                type="text"
                placeholder="How can I help you today?"
                className="w-full p-3 md:p-4 pr-12 rounded-lg bg-[#1F1F1F] dark:bg-[#2F2F2F] border border-gray-700 focus:outline-none focus:border-[#7C3AED] text-gray-200 placeholder-gray-400"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-[#7C3AED] rounded-lg hover:bg-[#6D28D9]">
                <ArrowUp size={20} />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-4">
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
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1F1F1F] p-6 rounded-lg w-full max-w-sm relative">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-200"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-6">Добро пожаловать</h2>
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    placeholder="Email адрес"
                    className="w-full pl-10 p-3 rounded-lg bg-[#2F2F2F] border border-gray-700 text-gray-200 placeholder-gray-500"
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="password"
                    placeholder="Пароль"
                    className="w-full pl-10 p-3 rounded-lg bg-[#2F2F2F] border border-gray-700 text-gray-200 placeholder-gray-500"
                  />
                </div>
              </div>
              <button className="w-full py-3 bg-[#7C3AED] rounded-lg font-medium hover:bg-[#6D28D9]">
                Войти
              </button>
              <p className="text-center text-gray-400 mt-4">
                Или продолжить через
              </p>
              <div className="flex gap-4">
                <button className="flex-1 p-3 bg-[#2F2F2F] rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 text-gray-300">
                  <FaGoogle size={20} /> Google
                </button>
                <button className="flex-1 p-3 bg-[#2F2F2F] rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 text-gray-300">
                  <FaVk size={20} /> VK
                </button>
              </div>
              <p className="text-center text-gray-400">
                Нет аккаунта?
                <button
                  onClick={() => {
                    setIsLoginModalOpen(false);
                    setIsRegisterModalOpen(true);
                  }}
                  className="text-[#7C3AED] hover:text-[#6D28D9]"
                >
                  Зарегистрироваться
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1F1F1F] p-6 rounded-lg w-full max-w-sm relative">
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-200"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-6">Регистрация</h2>
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    placeholder="Email адрес"
                    className="w-full pl-10 p-3 rounded-lg bg-[#2F2F2F] border border-gray-700 text-gray-200 placeholder-gray-500"
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="password"
                    placeholder="Пароль"
                    className="w-full pl-10 p-3 rounded-lg bg-[#2F2F2F] border border-gray-700 text-gray-200 placeholder-gray-500"
                  />
                </div>
              </div>
              <button className="w-full py-3 bg-[#7C3AED] rounded-lg font-medium hover:bg-[#6D28D9]">
                Зарегистрироваться
              </button>
              <p className="text-center text-gray-400 mt-4">
                Уже есть аккаунт?
                <button
                  onClick={() => {
                    setIsRegisterModalOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="text-[#7C3AED] hover:text-[#6D28D9]"
                >
                  Войти
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
