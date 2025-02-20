import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import $api from "../services/http";

export const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Используем useNavigate
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const token = new URLSearchParams(location.search).get("token");

  useEffect(() => {
    if (!token) {
      setError("Токен не найден.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Проверка на совпадение паролей
    if (password !== confirmPassword) {
      setError("Пароли не совпадают.");
      return;
    }

    try {
      await $api.post("/api/chats/reset-password", {
        token,
        newPassword: password,
      });
      setSuccess(true);
    } catch {
      setError("Ошибка при сбросе пароля.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Восстановление пароля</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {success && (
          <div className="text-green-500 text-center mb-4">
            Пароль успешно обновлён!
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Новый пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Подтверждение пароля
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Сбросить пароль
          </button>
        </form>

        {/* Кнопка для возврата на главную */}
        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  );
};
