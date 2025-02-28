
export const registerWithGoogle = async () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
};

const getQueryParam = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

// Обработчик для получения токена после редиректа
export const handleGoogleAuthRedirect = () => {
  const token = getQueryParam('token');
  
  if (token) {
    localStorage.setItem('authToken', token);
    // Можно почистить query-параметры из URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};

export const registerWithVK = async () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/vk`;
};
