import { toast } from "react-toastify";
import $api from "../http";

export const registerUser = async (params: {
  email: string;
  password: string;
}) => {
  try {
    await $api.post("/api/auth/register", params);

    // Success notification
    toast.success("Регистрация прошла успешно!");

    return true;
  } catch (error) {
    console.error("Ошибка при Регистрации:", error);

    // Error notification
    toast.error("Ошибка при регистрации. Пожалуйста, попробуйте снова.");

    return false;
  }
};
