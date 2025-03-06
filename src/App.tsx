import { useState, useEffect } from "react";
import {
  ChatGet,
  createChat,
  createSession,
  deleteChat,
  messageGet,
  sendMessageToAI,
} from "./services/chat/AiMessage";
import { useNavigate, useParams } from "react-router-dom";
import { LoginModal } from "./components/LoginModal";
import { RegisterModal } from "./components/RegisterModal";
import { ForgotPassword } from "./components/ForgotPassword";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import { ToastContainer } from "react-toastify";
import { handleGoogleAuthRedirect } from "./services/register/O2Auth";

export type chats = {
  id: number;
  createdAt: string;
  userId: null | number;
  sessionId: null | number;
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState("Fary3.0-Max");
  const [chats, setChats] = useState<chats[]>([]);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const [activeBarProfile, setActiveBarProfile] = useState(false);
  const [input, setinput] = useState("");

  const [isDarkMode, setIsDarkMode] = useState(false); // Светлая тема по умолчанию
  console.log("Current isDarkMode:", isDarkMode); // Отладка

  const versions = ["Fary3.0-Max", "Fary3.5-Ultra"];

  const [sessionId, setSessionId] = useState<string | null>(null);

  const initializeSession = async () => {
    try {
      const response = await createSession();
      const sessionId = response.sessionId;
      setSessionId(sessionId.toString()); // Храним как строку
      localStorage.setItem("sessionId", sessionId.toString()); // Сохраняем строкой
    } catch (error) {
      setIsRegisterModalOpen(true);
      console.error("Ошибка при создании сессии:", error);
    }
  };

  useEffect(() => {
    const storedSessionId = localStorage.getItem("sessionId");
    if (!storedSessionId) {
      initializeSession();
    } else {
      setSessionId(storedSessionId);
    }
  }, []);

  const handleVersionSelect = (version: string) => {
    setSelectedVersion(version);
    setIsVersionDropdownOpen(false);
  };

  useEffect(() => {
    if (sessionId) {
      initializeChat();
    }
  }, [sessionId]);

  useEffect(() => {
    console.log("Theme update - isDarkMode:", isDarkMode); // Отладка
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]); // Убедимся, что эффект срабатывает только при изменении isDarkMode

  const closeSidebarOnClickOutside = (e: React.MouseEvent) => {
    if (
      window.innerWidth <= 768 &&
      isSidebarOpen &&
      !(e.target as Element).closest(".sidebar")
    ) {
      setIsSidebarOpen(false);
    }
  };

  const { chatId } = useParams<{ chatId: string }>();

  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  useEffect(() => {
    handleGoogleAuthRedirect(); // Проверяем токен при загрузке страницы
  }, []);
  useEffect(() => {
    setMessages([]); // Очищаем сообщения перед загрузкой новой истории
    if (chatId) {
      loadChatHistory(chatId);
    }
  }, [chatId]);

  const loadChatHistory = async (chatId: string) => {
    try {
      const history = await messageGet(chatId);
      // Фильтруем дубликаты, сравнивая с текущими сообщениями
      const uniqueHistory = history.filter((msg) => {
        return !messages.some(
          (existingMsg) =>
            existingMsg.role === (msg.senderType === "USER" || msg.senderType === "GUEST" ? "user" : "assistant") &&
            existingMsg.content === msg.content
        );
      });
  
      setMessages((prevMessages) => [
        ...prevMessages.filter(
          (msg) =>
            !history.some(
              (histMsg) =>
                msg.role === (histMsg.senderType === "USER" || histMsg.senderType === "GUEST" ? "user" : "assistant") &&
                msg.content === histMsg.content
            )
        ),
        ...uniqueHistory.map((msg) => ({
          role: msg.senderType === "USER" || msg.senderType === "GUEST" ? "user" : "assistant",
          content: msg.content,
        })),
      ]);
    } catch (error) {
      console.error("Ошибка при загрузке истории сообщений:", error);
    }
  };
  const handleCreateChat = async () => {
    navigate("/chat"); // Переход на стартовую страницу без создания чата
  };

  const initializeChat = async () => {
    if (!sessionId) {
      console.error("Сессия не найдена!");
      return;
    }
    try {
      const response = await ChatGet(parseInt(sessionId, 10));
      setChats(response); // Просто загружаем список чатов
    } catch (error) {
      console.error("Ошибка при получении чатов:", error);
    }
  };

  const handleDeleteChat = async (id: string) => {
    if (!sessionId) {
      console.error("Сессия не найдена!");
      return;
    }

    const chatId = Number(id); // Преобразуем id в число
    if (isNaN(chatId)) {
      console.error("Некорректный chatId!");
      return;
    }

    try {
      await deleteChat(parseInt(sessionId, 10), chatId); // ✅ Преобразуем sessionId в число
      initializeChat();
    } catch (error) {
      console.error("Ошибка при удалении чата:", error);
    }
  };

  const [isPrinting, setIsPrinting] = useState(false);
  const [printInterval, setPrintInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  const printMessage = (message: string) => {
    let i = 0;
    const cleanMessage = message.replace(/['"]/g, ""); // Убираем кавычки, если есть

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "assistant", content: "" },
    ]);

    setIsPrinting(true); // Включаем печать

    const intervalId = setInterval(() => {
      setMessages((prevMessages) => {
        return prevMessages.map((msg, index) => {
          if (index === prevMessages.length - 1 && msg.role === "assistant") {
            return { ...msg, content: cleanMessage.slice(0, i + 1) };
          }
          return msg;
        });
      });

      i++;
      if (i >= cleanMessage.length) {
        clearInterval(intervalId);
        setIsPrinting(false); // Завершаем печать
      }
    }, 50);

    setPrintInterval(intervalId);
  };

  // Функция остановки печати
  const stopPrinting = () => {
    if (printInterval) {
      clearInterval(printInterval);
      setPrintInterval(null);
      setIsPrinting(false);
    }
  };

  const handleSendMessageWithStream = async (userMessage: string) => {
    setinput(""); // Очищаем поле ввода
    let currentChatId = chatId;
  
    if (!currentChatId) {
      if (!sessionId) {
        console.error("Сессия не найдена!");
        return;
      }
      try {
        const response = await createChat(parseInt(sessionId, 10));
        currentChatId = response.data.id.toString();
        navigate(`/chat/${currentChatId}`);
        setChats((prevChats) => [...prevChats, response.data]);
      } catch (error) {
        console.error("Ошибка при создании чата:", error);
        return;
      }
    }
  
    const userMessageObj = { role: "user", content: userMessage };
    setMessages((prevMessages) => [...prevMessages, userMessageObj]);
  
    try {
      const messagesToSend = [...messages, userMessageObj];
      await sendMessageToAI(
        setIsRegisterModalOpen,
        parseInt(currentChatId, 10),
        messagesToSend,
        (fullMessage: string) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { role: "assistant", content: fullMessage },
          ]);
        }
      );
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      setIsRegisterModalOpen(true);
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
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        chats={chats}
        isDarkMode={isDarkMode}
        handleCreateChat={handleCreateChat}
        handleDeleteChat={handleDeleteChat}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <Header
          initializeChat={initializeChat}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          selectedVersion={selectedVersion}
          setIsVersionDropdownOpen={setIsVersionDropdownOpen}
          isVersionDropdownOpen={isVersionDropdownOpen}
          versions={versions}
          handleVersionSelect={handleVersionSelect}
          activeBarProfile={activeBarProfile}
          setActiveBarProfile={setActiveBarProfile}
          token={token}
          setIsLoginModalOpen={setIsLoginModalOpen}
        />
        {/* Chat Area */}
        <ChatArea
          isSidebarOpen={isSidebarOpen}
          isDarkMode={isDarkMode}
          messages={messages}
          input={input}
          setinput={setinput}
          stopPrinting={stopPrinting}
          isPrinting={isPrinting}
          handleSendMessageWithStream={handleSendMessageWithStream}
        />
      </div>
      <ToastContainer />

      {/* Login Modal */}
      {isLoginModalOpen && (
        <LoginModal
          initializeChat={initializeChat}
          setIsLoginModalOpen={setIsLoginModalOpen}
          setIsRegisterModalOpen={setIsRegisterModalOpen}
          setIsForgotPasswordOpen={setIsForgotPasswordOpen}
        />
      )}

      {isRegisterModalOpen && (
        <RegisterModal
          setIsRegisterModalOpen={setIsRegisterModalOpen}
          setIsLoginModalOpen={setIsLoginModalOpen}
        />
      )}

      {isForgotPasswordOpen && (
        <ForgotPassword setIsForgotPasswordOpen={setIsForgotPasswordOpen} />
      )}
    </div>
  );
}

export default App;
