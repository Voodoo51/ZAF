import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../App";
import GoogleIcon from "../resources/google-icon.png"

export const LoginView = () => {
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => { 
    handleLogin()
  }, []);

  const handleLogin = () => {
    fetch('http://localhost:8080/user/login', 
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
    
    

    /*
    if (login === "admin" && password === "123") {
      setUser(login);
      navigate("/");
    } else {
      alert("Wrong credentials");
    }
    */
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
        value={formData.email}
        onChange={(e) => setFormData({email: e.target.value, password: formData.password})}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        value={formData.password}
        onChange={(e) => setFormData({email: formData.email, password: e.target.value})}
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