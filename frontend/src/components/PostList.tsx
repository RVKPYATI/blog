import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { getCookie } from "../utils/cookies";

interface Post {
  id: number;
  message: string;
  date: string;
  mediaUrl: string;
  username: string;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const token = getCookie("token");
  const user = getCookie("user");

  const handleDelete = async (postId: number) => {
    try {
      await axios.delete(`posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Ошибка при удалении поста", error);
      alert("Не удалось удалить пост. Возможно, у вас нет прав.");
    }
  };

  const getMediaElement = (mediaUrl: string | null) => {
    if (!mediaUrl) {
      return <div></div>;
    }

    const extension = mediaUrl.includes(".")
      ? mediaUrl.split(".").pop()?.toLowerCase()
      : null;

    if (!extension) {
      return <div></div>;
    }

    if (
      extension === "jpg" ||
      extension === "jpeg" ||
      extension === "png" ||
      extension === "gif"
    ) {
      return <img src={`http://localhost:5000/${mediaUrl}`} alt="Пост" />;
    } else if (
      extension === "mp4" ||
      extension === "avi" ||
      extension === "mov"
    ) {
      const videoMimeTypes: { [key: string]: string } = {
        mp4: "video/mp4",
        avi: "video/x-msvideo",
        mov: "video/quicktime",
      };

      return (
        <video controls>
          <source
            src={`http://localhost:5000/${mediaUrl}`}
            type={videoMimeTypes[extension] || "video/mp4"}
          />
          Ваш браузер не поддерживает видео.
        </video>
      );
    } else {
      return <div>Медиа не поддерживается</div>;
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<Post[]>("/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Ошибка при получении постов:", error);
      }
    };
    fetchPosts();
  }, []);

  if (posts.length === 0) return <div>Пока нет записей в блоге</div>;

  return (
    <>
      <h2 className="text-2xl mb-8">Последние записи в блоге</h2>
      <div className="w-1/2">
        {posts.map((post) => (
          <div key={post.id} className="shadow-md border rounded p-2">
            <p>{post.message}</p>
            <div className="w-1/3">{getMediaElement(post.mediaUrl)}</div>
            <div className="flex justify-end gap-2">
              <p>
                Дата{" "}
                <span className="italic font-light">
                  {post.date.slice(0, 10)}
                </span>
              </p>
              <p>
                Автор: <span className="font-semibold">{post.username}</span>
              </p>
              {user === post.username ? (
                <div>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="font-semibold"
                  >
                    Удалить
                  </button>
                  <a href={`/edit/${post.id}`}>Редактировать</a>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PostList;
