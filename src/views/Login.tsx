import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../App";
import { useTranslation } from "react-i18next";
import GitHubIcon from "../resources/github-icon.png";
import plFlag from "../resources/pl.png";
import enFlag from "../resources/en.png";

export const LoginView = () => {
  const { setUser } = useAppContext();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorId, setErrorId] = useState(-1);

  useEffect(() => {
    handleGetUser();
  }, []);

  const handleGetUser = () => {
    fetch("http://localhost:8080/auth/me", {
      credentials: "include",
      mode: "cors",
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(res =>
        res.json().then(data => {
          setUser(data);
          navigate("/");
        })
      )
      .catch(err => console.log("Error receiving user info:", err));
  };

  const handleLogin = () => {

    fetch("http://localhost:8080/auth/login", {
      credentials: "include",
      mode: "cors",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(res => {
        if (res.ok) {
          handleGetUser();
        } else {
          setUser(null);
          setErrorId(0);
        }
      })
      .catch(() => {
        setUser(null);
        setErrorId(1);
      });
  };

  const handleGithubOAuthLogin = () => {
    window.location.href = "http://localhost:8080/auth/github/oauth";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md relative">

        {/* Language switcher */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => i18n.changeLanguage("pl")}
            className={`text-2xl transition hover:scale-110 ${
              i18n.language === "pl" ? "opacity-100" : "opacity-40"
            }`}
            title="Polski"
          >
            <img src={plFlag} alt="PL" className="w-8 h-5 object-cover rounded-sm" />
          </button>

          <button
            onClick={() => i18n.changeLanguage("en")}
            className={`text-2xl transition hover:scale-110 ${
              i18n.language === "en" ? "opacity-100" : "opacity-40"
            }`}
            title="English"
          >
              <img src={enFlag} alt="EN" className="w-8 h-5 object-cover rounded-sm" />
          </button>
        </div>

        <h1 className="text-2xl font-semibold text-center mb-6">
          {t("login.title")}
        </h1>

        <input
          placeholder={t("login.login")}
          className="w-full mb-3 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={formData.email}
          onChange={(e) =>
            setFormData({ email: e.target.value, password: formData.password })
          }
        />

        <input
          type="password"
          placeholder={t("login.password")}
          className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={formData.password}
          onChange={(e) =>
            setFormData({ email: formData.email, password: e.target.value })
          }
        />

        {/* Error message */}
        {errorId !== -1 && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded-lg text-center">
            {errorId === 0 && t("inputErrors.wrongLogin") }
            {errorId === 1 && t("errors.server") }
          </div>
        )}

        <div className="flex justify-between items-center text-sm mb-5">
          <label className="flex items-center gap-2 text-gray-600">
            <input type="checkbox" />
            {t("login.rememberPassword")}
          </label>
          <span className="text-blue-500 underline cursor-pointer">
            {t("login.forgotPassword")}
          </span>
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-3 mb-4 rounded-lg text-white bg-[rgb(63,152,255)] hover:opacity-90 transition"
        >
          {t("login.signIn")}
        </button>

        <button
          onClick={handleGithubOAuthLogin}
          className="w-full py-3 mb-4 rounded-lg border border-gray-300 bg-white flex items-center justify-center gap-3 hover:bg-gray-50 transition"
        >
          <img src={GitHubIcon} width={20} />
          <span className="text-sm">{t("login.signInWithGitHub")}</span>
        </button>
      </div>
    </div>
  );
};