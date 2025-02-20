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

  const [isDarkMode, setIsDarkMode] = useState(true);

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
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

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
    if (chatId) {
      loadChatHistory(chatId);
    }
  }, [chatId]);

  const loadChatHistory = async (chatId: string) => {
    try {
      const history = await messageGet(chatId);
      setMessages(
        history.map((msg) => ({
          role:
            msg.senderType === "USER" || msg.senderType === "GUEST"
              ? "user"
              : "assistant",
          content: msg.content,
        }))
      );
    } catch (error) {
      console.error("Ошибка при загрузке истории сообщений:", error);
    }
  };

  const handleCreateChat = async () => {
    if (!sessionId) {
      console.error("Сессия не найдена!");
      return;
    }

    try {
      const response = await createChat(parseInt(sessionId, 10)); // ✅ Преобразуем sessionId в число
      console.log("Чат создан:", response.data);
      initializeChat();
    } catch (error) {
      console.error("Ошибка при создании чата:", error);
    }
  };

  const initializeChat = async () => {
    if (!sessionId) {
      console.error("Сессия не найдена!");
      return;
    }

    try {
      const response = await ChatGet(parseInt(sessionId, 10)); // ✅ Преобразуем в число перед отправкой
      setChats(response);

      if (response.length === 0) {
        const newChatResponse = await createChat(parseInt(sessionId, 10));
        const newChat = newChatResponse.data;
        const updatedChats = await ChatGet(parseInt(sessionId, 10));
        setChats(updatedChats);

        if (newChat && newChat.id) {
          navigate(`/chat/${newChat.id}`);
        } else {
          console.error("Ошибка: новый чат не содержит ID!", newChat);
        }
      } else {
        navigate(`/chat/${response[0].id}`);
      }
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
  // Функция для имитации печати AI
  const printMessage = (message: string) => {
    let i = 0;
    const cleanMessage = message.replace(/['"]/g, ""); // Убираем кавычки, если есть

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "assistant", content: "" }, // Добавляем пустое сообщение перед анимацией
    ]);

    const intervalId = setInterval(() => {
      setMessages((prevMessages) => {
        return prevMessages.map((msg, index) => {
          if (index === prevMessages.length - 1 && msg.role === "assistant") {
            return { ...msg, content: cleanMessage.slice(0, i + 1) }; // Вместо посимвольного добавления
          }
          return msg;
        });
      });

      i++;
      if (i >= cleanMessage.length) {
        clearInterval(intervalId);
      }
    }, 50);
  };

  // Когда приходит новый чанк от AI, используем функцию printMessage
  const handleSendMessageWithStream = async (userMessage: string) => {
    if (!chatId) {
      console.error("Chat ID не найден!");
      return;
    }

    setinput(""); // очищаем инпут сразу

    // Добавляем сообщение пользователя в состояние сразу
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: userMessage },
    ]);

    try {
      const messageHistory = await messageGet(chatId);
      const messages = messageHistory.map((msg) => ({
        role:
          msg.senderType === "USER" || msg.senderType === "USER"
            ? "user"
            : "assistant",
        content: msg.content,
      }));

      messages.push({ role: "user", content: userMessage });

      await sendMessageToAI(
        setIsRegisterModalOpen,
        parseInt(chatId, 10),
        messages,
        (chunk: string) => {
          printMessage(chunk);
        }
      );
    } catch (error) {
      setIsRegisterModalOpen(true);
      console.error("Ошибка при отправке сообщения:", error);
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
          handleSendMessageWithStream={handleSendMessageWithStream}
        />
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <LoginModal
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
