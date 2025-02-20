
export const registerWithGoogle = async () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
};

export const registerWithVK = async () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/vk`;
};
