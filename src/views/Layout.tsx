import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext, useFilter } from "../App";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const { setUser } = useAppContext();
  const { i18n, t } = useTranslation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
      <div>
        <div className="flex justify-evenly items-center text-sm mt-4">
          <div className="text-lg font-semibold mb-6">{t("app.name")}</div>
          <button onClick={() => i18n.changeLanguage("pl")}>
            PL
          </button>
          <button onClick={() => i18n.changeLanguage("en")}>
            EN
          </button>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
<<<<<<< HEAD
        <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/">Home</Link>
        <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/profile">Profile</Link>
        <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/creator">Form Creator</Link>
        <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/payment">Payments</Link>
=======
        <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/">{t("navigation.home")}</Link>
        <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/profile">{t("navigation.profile")}</Link>
        <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/form">{t("navigation.form")}</Link>
        <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/forms">{t("navigation.forms")}</Link>
        <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/creator">{t("navigation.formCreator")}</Link>
>>>>>>> czarek
      </nav>

      <button
        className="mt-auto px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100"
        onClick={() => {
          fetch('http://localhost:8080/auth/logout',
              {
                credentials: 'include', 
                mode: 'cors',
                method: 'POST',
              } 
          )
          .then(res => {
            if (res.ok) {
              setUser(null);
            }
          }).catch(err => console.log('Error logging out user:', err));
        }}
      >
        {t("navigation.logout")}
      </button>
    </aside>
  );
};


const TopBar = () => {
 const { filterId, setFilterId } = useFilter();
 const { t } = useTranslation();

const baseClass = "px-3 py-1.5 rounded-full text-sm";
const getClass = (number: number) =>
    filterId === number
      ? `${baseClass} text-white bg-[rgb(63,152,255)]`
      : `${baseClass} bg-gray-200 text-gray-700`;

 return (
  <div className="flex items-center justify-between mb-4">
    <input
      placeholder={t("common.search")}
      className="w-1/3 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300"
    />

    <div className="flex gap-2">
      <button className={getClass(-1)} onClick={() => setFilterId(-1)}>{t("filters.all")} {filterId === -1 && "✓"}  </button>
      <button className={getClass(0)} onClick={() => setFilterId(0)}>{t("filters.accepted")} {filterId === 0 && "✓"} </button>
      <button className={getClass(1)} onClick={() => setFilterId(1)}>{t("filters.pending")} {filterId === 1 && "✓"}  </button>
      <button className={getClass(2)} onClick={() => setFilterId(2)}>{t("filters.rejected")} {filterId === 2 && "✓"} </button>
      <button className={getClass(3)} onClick={() => setFilterId(3)}>{t("filters.unsent")} {filterId === 3 && "✓"}  </button>
      <button className={getClass(4)} onClick={() => setFilterId(4)}>{t("filters.requiresUpdate")} {filterId === 4 && "✓"}  </button>
    </div>
  </div>
);
};

export const Layout = ({ children }: { children: ReactNode }) => {

    const [active, setActive] = useState("all");
    return(
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar />
    <main className="flex-1 p-6">
      <TopBar/>
      <div>{children}</div>
    </main>
  </div>
);
};
