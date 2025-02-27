import { Lock, Mail, X } from "lucide-react";
import { FaGoogle, FaVk } from "react-icons/fa";
import {
  registerWithGoogle,
  registerWithVK,
} from "../services/register/O2Auth";
import { useState } from "react";
import { loginUser } from "../services/auth/loginUser";

interface LoginModalProps {
  setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRegisterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsForgotPasswordOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginModal = ({
  setIsLoginModalOpen,
  setIsRegisterModalOpen,
  setIsForgotPasswordOpen,
}: LoginModalProps) => {
  const [inputPassword, setinputPassword] = useState("");
  const [inputEmail, setinputEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

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
      await loginUser({ email: inputEmail, password: inputPassword });
      setIsLoginModalOpen(false);
    } catch {
      setErrors({ password: "Неправильный email или пароль" });
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1F1F1F] p-6 rounded-lg w-full max-w-sm relative">
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-200"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-6">Добро пожаловать</h2>
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
          <p className="text-center text-gray-400 mt-4">Или продолжить через</p>
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
      </div>
    </div>
  );
};
