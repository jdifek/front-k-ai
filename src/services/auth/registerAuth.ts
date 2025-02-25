import $api from "../http";

export const registerUser = async (params: {
  email: string;
  password: string;
}) => {
  try {
    await $api.post("/api/auth/register", params);
    return true;
  } catch (error) {
    console.error("Ошибка при Регистрации:", error);
    return false;
  }
};
