import { Mail, X } from "lucide-react";
import { useState } from "react";
import { ForgotPasswordF } from "../services/auth/forgotPass";

interface ForgotPasswordProps {
  setIsForgotPasswordOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ForgotPassword = ({
  setIsForgotPasswordOpen,
}: ForgotPasswordProps) => {
  const [inputEmail, setinputEmail] = useState("");

  const handleForgotPassword = (email: string) => {
    ForgotPasswordF(email);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1F1F1F] p-6 rounded-lg w-full max-w-sm relative">
        <button onClick={() => setIsForgotPasswordOpen(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-200">
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-6">Поменять пароль</h2>
        <div className="relative mb-5">
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
        <button
          onClick={() => handleForgotPassword(inputEmail)}
          className="w-full py-3 bg-[#7C3AED] rounded-lg font-medium hover:bg-[#6D28D9]"
        >
          Войти
        </button>
      </div>
    </div>
  );
};
