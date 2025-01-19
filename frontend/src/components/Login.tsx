import React, { useState } from "react";
import axios from "../utils/axios";
import { setCookie } from "../utils/cookies";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", {
        username,
        password,
      });
      setCookie("token", response.data.token);
      setCookie("user", username);
      alert("Вы успешно вошли");
      navigate("/");
    } catch (error) {
      console.error("Ошибка при входе:", error);
      alert("Неверное имя пользователя или пароль");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col justify-center w-1/3 mx-auto border p-2 shadow-md">
        <h2 className="text-2xl font-semibold text-center">Вход</h2>
        <div className="text-xl flex flex-col">
          <label>Логин:</label>
          <input
            type="text"
            className="border h-10"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="text-xl flex flex-col">
          <label>Пароль:</label>
          <input
            type="password"
            className="border h-10"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-slate-700 px-3 py-1 rounded text-white text-xl hover:bg-slate-800"
          >
            Войти
          </button>
          <a href="/register" className="cursor-pointer ml-2 text-xl">
            Зарегистрироваться
          </a>
        </div>
      </div>
    </form>
  );
};

export default Login;
