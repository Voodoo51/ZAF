import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../App";
import GoogleIcon from "../resources/google-icon.png"

export const LoginView = () => {
  const { setUser } = useAppContext();
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (login === "admin" && password === "123") {
      setUser(login);
      navigate("/");
    } else {
      alert("Wrong credentials");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md">
      <h1 className="text-2xl font-semibold text-center mb-6">
        E-Dziekanat
      </h1>

      <input
        placeholder="Login"
        className="w-full mb-3 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        autoFocus
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => {
          if(e.key == "Enter")
            handleLogin();
        }}
      />

      <div className="flex justify-between items-center text-sm mb-5">
        <label className="flex items-center gap-2 text-gray-600">
          <input type="checkbox" />
          Zapamiętaj hasło
        </label>
        <span className="text-blue-500 underline cursor-pointer">
          Nie pamiętasz hasła?
        </span>
      </div>

      <button
        onClick={handleLogin}
        className="w-full py-3 mb-4 rounded-lg text-white bg-[rgb(63,152,255)] hover:opacity-90 transition"
      >
        Zaloguj się
      </button>

      <button className="w-full py-3 mb-4 rounded-lg border border-gray-300 bg-white flex items-center justify-center gap-3 hover:bg-gray-50 transition">
        <img src={GoogleIcon} width={20} />
        <span className="text-sm">
          Zaloguj się za pomocą Google
        </span>
      </button>

      <div className="text-sm text-center">
        <span className="text-gray-500">Nie masz konta? </span>
        <span className="text-blue-500 underline cursor-pointer">
          Zarejestruj się
        </span>
      </div>
    </div>
  </div>
  );
};