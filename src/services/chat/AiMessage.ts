import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $api from "../http";
import { ImessageGet, IsendMessageToAI } from "../../types/messageGet";

export const sendMessageToAI = async (
  onRegisterOpen: React.Dispatch<React.SetStateAction<boolean>>,
  chatId: number,
  messages: IsendMessageToAI[],
  onMessage: (message: string) => void
) => {
  const token = localStorage.getItem("authToken"); // Откуда ты хранишь токен
  const userId = getUserIdFromToken(token);

  try {
    const response = await $api.post(
      "/api/chats/message",
      { chatId, messages, userId },
      { responseType: "stream" }
    );

    if (response.data && response.data.getReader) {
      const reader = response.data.getReader();
      const decoder = new TextDecoder();
      let message = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const decodedText = decoder.decode(value, { stream: true });
        message += decodedText;

        onMessage(message);
      }
    } else {
      onMessage(response.data);
    }
  } catch (error: any) {
    onRegisterOpen(true);
    console.error("Ошибка при получении ответа от AI:", error);

    // Показываем тост с ошибкой
    toast.error("Ошибка: необходимо авторизоваться!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  }
};


export const createChat = async (sessionId: number) => {
  const token = localStorage.getItem("authToken"); // Или откуда ты хранишь
  const userId = getUserIdFromToken(token);
  console.log(userId);
  return await axios.post(`${import.meta.env.VITE_API_URL}/api/chats`, {
    sessionId,
    userId,
  });
};

export const createSession = async () => {
  const token = localStorage.getItem("authToken");
  const userId = getUserIdFromToken(token);
  if (userId) {
    return (
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chats/session`,
        userId
      )
    ).data;
  }
  return (await axios.post(`${import.meta.env.VITE_API_URL}/api/chats/session`))
    .data;
};

export const deleteChat = async (sessionId: number, chatId: number) => {
  const token = localStorage.getItem("authToken");
  const userId = getUserIdFromToken(token);
  return await axios.delete(
    `${import.meta.env.VITE_API_URL}/api/chats/delete`,
    {
      params: { sessionId, chatId, userId }, // Передаём параметры через params
    }
  );
};

export const ChatGet = async (sessionId: number) => {
  const token = localStorage.getItem("authToken");
  const userId = getUserIdFromToken(token);
  return (
    await axios.get(`${import.meta.env.VITE_API_URL}/api/chats/get`, {
      params: {
        sessionId: sessionId,
        userId,
      },
    })
  ).data;
};

export const messageGet = async (chatId: string): Promise<ImessageGet[]> => {
  return (
    await axios.get<ImessageGet[]>(
      `${import.meta.env.VITE_API_URL}/api/chats/get-message`,
      {
        params: {
          chatId: chatId,
        },
      }
    )
  ).data;
};

export function getUserIdFromToken(token: string) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1]; // Берём payload
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = JSON.parse(atob(base64));
    return decodedPayload.userId; // Или другой ключ, зависит от бэкенда
  } catch (error) {
    console.error("Ошибка при декодировании токена", error);
    return null;
  }
}
