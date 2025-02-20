import $api from "../http";

export const ForgotPasswordF = async (email: string) => {
  try {
    const response = (await $api.post("/api/chats/forgot-password", { email }))
      .data;
  } catch (error: unknown) {
    console.error("Ошибка:", error);
    return {};
  }
};
