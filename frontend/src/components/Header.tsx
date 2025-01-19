import { getCookie, removeCookie } from "../utils/cookies";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const token = getCookie("token");
  const user = getCookie("user");
  const navigate = useNavigate();

  const logOut = async () => {
    removeCookie("token");
    navigate("/");
  };

  return (
    <header className="container mx-auto flex justify-between bg-slate-600 p-8">
      <div className="text-4xl text-white font-semibold">
        <a href="/">Личный блог</a>
      </div>
      <div className="text-white text-2xl">
        {token ? (
          <div className="flex gap-3">
            <div className="flex items-center justify-center w-20 h-20 rounded-full border-white border-2 p-4 capitalize bg-slate-500">
              {user}
            </div>

            <div>
              <div>
                <a href="/create">Добавить запись</a>
              </div>
              <div>
                <button onClick={logOut}>Выйти</button>
              </div>
            </div>
          </div>
        ) : (
          <a href="/login">Войти/Зарегистрироваться</a>
        )}
      </div>
    </header>
  );
};
