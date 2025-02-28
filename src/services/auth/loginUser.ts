import { toast } from "react-toastify";
import $api from "../http";

interface LoginUserRes {
  token?: string;
}

export const loginUser = async (params: {
  email: string;
  password: string;
}): Promise<LoginUserRes> => {
  try {
    const response = await $api.post("/api/auth/login", params);
    const data: LoginUserRes = response.data;

    console.log(data);

    if (data.token) {
      localStorage.setItem("authToken", data.token);

      // Success notification
      toast.success("Вы успешно вошли в систему!");
    }

    return data;
  } catch (error: unknown) {
    console.error("Ошибка при авторизации:", error);

    // Error notification
    toast.error("Ошибка при авторизации. Пожалуйста, попробуйте снова.");

    return {}; // Возвращаем пустой объект, чтобы избежать undefined
  }
};
