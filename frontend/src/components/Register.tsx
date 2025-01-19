import React, { useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("/auth/register", {
        username,
        password,
      });

      alert("Пользователь зарегистрирован");
      navigate("/login");
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      alert("Произошла ошибка при регистрации");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col justify-center w-1/3 mx-auto border p-2 shadow-md">
        <h2 className="text-2xl font-semibold text-center">Регистрация</h2>
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
            Зарегистрироваться
          </button>
          <a href="/login" className="cursor-pointer ml-2 text-xl">
            Войти
          </a>
        </div>
      </div>
    </form>
  );
};

export default Register;
