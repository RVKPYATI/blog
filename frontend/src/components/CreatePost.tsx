import React, { useState } from "react";
import axios from "../utils/axios";
import { getCookie } from "../utils/cookies";
import { useNavigate } from "react-router-dom";

interface CreatePostProps {
  token: string;
}

const CreatePost: React.FC<CreatePostProps> = () => {
  const token = getCookie("token");
  const navigate = useNavigate();

  const [message, setMessage] = useState<string>("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMediaFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("message", message);
    if (mediaFile) {
      formData.append("mediaFile", mediaFile);
    }

    try {
      await axios.post("/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Запись создана");
      navigate("/");
      setMessage("");
      setMediaFile(null);
    } catch (error) {
      console.error("Ошибка при создании записи:", error);
      alert("Произошла ошибка при создании записи");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label
          htmlFor="message"
          className="block text-gray-700 font-medium mb-2"
        >
          Ваше сообщение
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="file" className="block text-gray-700 font-medium mb-2">
          Прикрепить изображение или видео
        </label>
        <input
          id="file"
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="w-full text-gray-700"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-slate-600 text-white font-medium py-2 px-4 rounded-md hover:bg-slate-800 transition-colors"
      >
        Создать запись
      </button>
    </form>
  );
};

export default CreatePost;
