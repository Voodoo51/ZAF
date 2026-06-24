import { useTranslation } from "react-i18next";
import { useAppContext } from "../App";

export const ProfileView = () => {
  const { t } = useTranslation();
  const { user } = useAppContext();
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h1 className="text-2xl font-semibold">{t("profile.title")}</h1>
      <p className="text-gray-600 mt-2">{t("profile.welcome", {name: user?.name, surname: user?.surname})}</p>
    </div>
  );
};