import { Lock, Mail, X } from "lucide-react";
import { FaGoogle, FaVk } from "react-icons/fa";
import {
  registerWithGoogle,
  registerWithVK,
} from "../services/register/O2Auth";
import { useState } from "react";
import { registerUser } from "../services/auth/registerAuth";

interface RegisterModalProps {
  setIsRegisterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RegisterModal = ({
  setIsRegisterModalOpen,
  setIsLoginModalOpen,
}: RegisterModalProps) => {
  const [inputPassword, setinputPassword] = useState("");
  const [inputEmail, setinputEmail] = useState("");

  const handleRegisterUser = (email: string, password: string) => {
    registerUser({ email, password });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1F1F1F] p-6 rounded-lg w-full max-w-sm relative">
        <button
          onClick={() => setIsRegisterModalOpen(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-200"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-6">Регистрация</h2>
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
          </div>
          <button
            onClick={() => handleRegisterUser(inputEmail, inputPassword)}
            className="w-full py-3 bg-[#7C3AED] rounded-lg font-medium hover:bg-[#6D28D9]"
          >
            Зарегистрироваться
          </button>
          <p className="text-center text-gray-400 mt-4">
            Уже есть аккаунт?
            <button
              onClick={() => {
                setIsRegisterModalOpen(false);
                setIsLoginModalOpen(true);
              }}
              className="text-[#7C3AED] hover:text-[#6D28D9]"
            >
              Войти
            </button>
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
        </div>
      </div>
    </div>
  );
};
