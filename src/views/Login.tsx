import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../App";
import GitHubIcon from "../resources/github-icon.png"
import { useTranslation } from "react-i18next";

export const LoginView = () => {
  const { user, setUser } = useAppContext();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => { 
    handleGetUser()
  }, []);

  const handleGetUser = () => 
  {
    fetch('http://localhost:8080/auth/me', 
      {
        credentials: 'include', 
        mode: 'cors',
        method: 'GET', 
        headers: {'Content-Type': 'application/json'},
      }).then(res2 => res2.json().then(data => {
        console.log('Response:', data);
        setUser(data);
        navigate("/");
      }).catch(err => console.log('Error parsing user info:', err))).catch(err => console.log('Error receiving user info:', err))
  }

  const handleLogin = () => {
    fetch('http://localhost:8080/auth/login', 
      {
        credentials: 'include', 
        mode: 'cors',
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      })
    .then(res => {
      if (res.ok) { //later, add internal server error handling(and other errors handling aswell)
        handleGetUser();
      } else setUser(null);
    }
    ).catch(err => console.log('Error receiving user info:', err));
    


    

    /*


  const handleLogin = () => {
    fetch('http://localhost:8080/auth/login', 
      {
        credentials: 'include', 
        mode: 'cors',
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      })
    .then(res => res.json()
      .then(data => {
        if (res.ok) { //later, add internal server error handling(and other errors handling aswell)
          console.log('Response:', data);
          
          setUser(data);
          navigate("/");
        } else setUser(null);
      }).catch(err => {
        setUser(null); //just in case
        console.log('Error parsing user info:', err)}
      )
    ).catch(err => console.log('Error receiving user info:', err));
    
    


    if (login === "admin" && password === "123") {
      setUser(login);
      navigate("/");
    } else {
      alert("Wrong credentials");
    }
    */
  };

const handleGithubOAuthLogin = () => {
  window.location.href = 'http://localhost:8080/auth/github/oauth';
};
  /*
  const handleGithubOAuthLogin = () => {
    fetch('http://localhost:8080/auth/github/oauth', 
      {
        credentials: 'include', 
        mode: 'cors',
        method: 'GET'
      })
    .then(res => {
      if (res.ok) { //later, add internal server error handling(and other errors handling aswell)
        handleGetUser();
      } else setUser(null);
    }
    ).catch(err => console.log('Error receiving user info:', err));
  };
  */

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md">
      <h1 className="text-2xl font-semibold text-center mb-6">
        {t("login.title")}
      </h1>

      <input
        placeholder={t("login.login")}
        className="w-full mb-3 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        value={formData.email}
        onChange={(e) => setFormData({email: e.target.value, password: formData.password})}
      />

      <input
        type="password"
        placeholder={t("login.password")}
        className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        value={formData.password}
        onChange={(e) => setFormData({email: formData.email, password: e.target.value})}
      />

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
        className="w-full py-3 mb-4 rounded-lg border border-gray-300 bg-white flex items-center justify-center gap-3 hover:bg-gray-50 transition">
        <img src={GitHubIcon} width={20} />
        <span className="text-sm">
          {t("login.signInWithGitHub")}
        </span>
      </button>

      <div className="flex justify-evenly items-center text-sm mt-4">
        <button onClick={() => i18n.changeLanguage("pl")}>
          PL
        </button>
        <button onClick={() => i18n.changeLanguage("en")}>
          EN
        </button>
      </div>
    </div>
  </div>
  );
};