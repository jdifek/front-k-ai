import { Lock, Mail, X } from "lucide-react";
import { FaGoogle, FaVk } from "react-icons/fa";
import {
  registerWithGoogle,
  registerWithVK,
} from "../services/register/O2Auth";
import { useEffect, useState } from "react";
import { loginUser } from "../services/auth/loginUser";

// First, let's define the LoadingAnimation component
const LoadingAnimation = ({ isDarkMode = true }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        // Slow down progress as it approaches 100%
        const increment = Math.max(0.5, (100 - prevProgress) / 20);
        const newProgress = prevProgress + increment;
        return newProgress >= 100 ? 0 : newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // We're using dark mode colors since your login modal has a dark theme
  const textColor = "text-gray-200";
  const pulseColor = "bg-gray-700";
  const progressColor = "bg-purple-600";
  const dotColor = "bg-purple-400";

  return (
    <div className="flex flex-col items-center justify-center w-full py-4 space-y-4">
      {/* Bouncing dots */}
      <div className="flex space-x-2">
        {[0, 1, 2].map((dot) => (
          <div
            key={dot}
            className={`w-2 h-2 rounded-full ${dotColor} animate-bounce`}
            style={{
              animationDelay: `${dot * 0.2}s`,
              animationDuration: "0.8s",
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md">
        <div
          className={`h-1.5 w-full rounded-full ${pulseColor} overflow-hidden`}
        >
          <div
            className={`h-full ${progressColor} rounded-full transition-all duration-300 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Loading text */}
      <div className={`${textColor} text-sm font-medium`}>
        Входим в систему...
      </div>
    </div>
  );
};

interface LoginModalProps {
  initializeChat: () => Promise<void>;
  setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRegisterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsForgotPasswordOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginModal = ({
  setIsLoginModalOpen,
  initializeChat,
  setIsRegisterModalOpen,
  setIsForgotPasswordOpen,
}: LoginModalProps) => {
  const [inputPassword, setinputPassword] = useState("");
  const [inputEmail, setinputEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!inputEmail.trim()) {
      newErrors.email = "Введите email";
    } else if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(inputEmail)) {
      newErrors.email = "Введите корректный email";
    }

    if (!inputPassword.trim()) {
      newErrors.password = "Введите пароль";
    } else if (inputPassword.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginUser = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true); // Start loading animation
      await loginUser({
        email: inputEmail,
        password: inputPassword,
      });
      setIsLoginModalOpen(false);
      await initializeChat();
    } catch {
      setErrors({ password: "Неправильный email или пароль" });
    } finally {
      setIsLoading(false); // Stop loading animation
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1F1F1F] p-6 rounded-lg w-full max-w-sm relative">
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-200"
          disabled={isLoading}
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-6">Добро пожаловать</h2>

        {isLoading ? (
          <LoadingAnimation />
        ) : (
          <div className="space-y-4">
            <div>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  value={inputEmail}
                  onChange={(e) => setinputEmail(e.target.value)}
                  type="email"
                  placeholder="Email адрес"
                  className="w-full pl-10 p-3 rounded-lg bg-[#2F2F2F] border border-gray-700 text-gray-200 placeholder-gray-500"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  value={inputPassword}
                  onChange={(e) => setinputPassword(e.target.value)}
                  type="password"
                  placeholder="Пароль"
                  className="w-full pl-10 p-3 rounded-lg bg-[#2F2F2F] border border-gray-700 text-gray-200 placeholder-gray-500"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <button
              onClick={() => handleLoginUser()}
              className="w-full py-3 bg-[#7C3AED] rounded-lg font-medium hover:bg-[#6D28D9]"
            >
              Войти
            </button>
            <p
              className="text-center cursor-pointer text-[#7C3AED] hover:text-[#6D28D9] mt-4"
              onClick={() => {
                setIsForgotPasswordOpen(true);
                setIsLoginModalOpen(false);
                setIsRegisterModalOpen(false);
              }}
            >
              Забыли пароль?
            </p>
            <p className="text-center text-gray-400 mt-4">
              Или продолжить через
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => registerWithGoogle()}
                className="flex-1 p-3 bg-[#2F2F2F] rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 text-gray-300"
              >
                <FaGoogle size={20} /> Google
              </button>

              <button
                onClick={() => registerWithVK()}
                className="flex-1 p-3 bg-[#2F2F2F] rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 text-gray-300"
              >
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
        )}
      </div>
    </div>
  );
};
