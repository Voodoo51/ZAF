import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const RegisterUserView = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [backendErrors, setBackendErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    role: {
      id: 1,
      name: "supervisor",
    },
  });

  const [errors, setErrors] = useState({
    email: false,
    password: false,
    name: false,
    surname: false,
  });

  const rolesT = [
    t("roles.supervisor"),
    t("roles.worker"),
    t("roles.student"),
  ];

  const roles = ["supervisor", "worker", "student"];

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 3;
  };

  const validateName = (name: string) => {
    return /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:[- ][A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)*$/.test(
      name.trim()
    );
  };

  const clearError = (field: keyof typeof errors) => {
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleRegister = () => {
    const newErrors = {
      email: !validateEmail(formData.email),
      password: !validatePassword(formData.password),
      name: !validateName(formData.name),
      surname: !validateName(formData.surname),
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) return;

    fetch("http://localhost:8080/user/register", {
      credentials: "include",
      mode: "cors",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    .then(async (response) => {
      if (!response.ok) {
        const data = await response.json();

        setBackendErrors(Object.values(data));
        return;
      }

      navigate("/users");
    })
    .catch((err) => console.log("Error creating user:", err));

    console.log(formData);
  };

  return (
    <div className="py-10 flex items-start justify-center bg-gray-50 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md">

      {backendErrors.length > 0 && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4">
          <div className="flex items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M12 3l9 16H3L12 3z"
              />
            </svg>

            <h3 className="font-semibold text-red-700">
              {t("errors.server")}
            </h3>
          </div>

          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {backendErrors.map((error, index) => (
              <li key={index}>{t(error)}</li>
            ))}
          </ul>
        </div>
      )}

        <h1 className="text-2xl font-semibold text-center mb-6 mt-6">
          {t("register.title")}
        </h1>

        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {t("inputErrors.incorrectEmail")}
          </p>
        )}
        <input
          type="email"
          placeholder={t("register.login")}
          className={`w-full mb-3 px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition
            ${
              errors.email
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-300"
            }`}
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            clearError("email");
          }}
        />

        {errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {t("inputErrors.shortPassword")}
          </p>
        )}
        <input
          type="password"
          placeholder={t("register.password")}
          className={`w-full mb-3 px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition
            ${
              errors.password
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-300"
            }`}
          value={formData.password}
          onChange={(e) => {
            setFormData({ ...formData, password: e.target.value });
            clearError("password");
          }}
        />

        {errors.name && (
          <p className="text-red-500 text-sm mt-1">
            {t("inputErrors.capitalName")}
          </p>
        )}
        <input
          placeholder={t("register.name")}
          className={`w-full mb-3 px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition
            ${
              errors.name
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-300"
            }`}
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            clearError("name");
          }}
        />

        {errors.surname && (
          <p className="text-red-500 text-sm mt-1">
            {t("inputErrors.capitalSurname")}
          </p>
        )}
        <input
          placeholder={t("register.surname")}
          className={`w-full mb-4 px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition
            ${
              errors.surname
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-300"
            }`}
          value={formData.surname}
          onChange={(e) => {
            setFormData({ ...formData, surname: e.target.value });
            clearError("surname");
          }}
        />

        <select
          className="w-full appearance-none mb-4 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={formData.role.id}
          onChange={(e) =>
            setFormData({
              ...formData,
              role: {
                id: Number(e.target.value),
                name: roles[Number(e.target.value) - 1],
              },
            })
          }
        >
          <option value="1">{rolesT[0]}</option>
          <option value="2">{rolesT[1]}</option>
          <option value="3">{rolesT[2]}</option>
        </select>

        <button
          onClick={handleRegister}
          className="w-full py-3 mb-4 rounded-lg text-white bg-[rgb(63,152,255)] hover:opacity-90 transition"
        >
          {t("register.register")}
        </button>
      </div>
    </div>
  );
};