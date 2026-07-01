import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext, useFilter } from "../App";
import { useTranslation } from "react-i18next";
import plFlag from "../resources/pl.png";
import enFlag from "../resources/en.png";

const Sidebar = () => {
  const { user, setUser } = useAppContext();
  const { i18n, t } = useTranslation();

  return (
    <aside className="sticky top-0 h-screen w-64 bg-white border-r border-gray-200 p-4 flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between mt-4 mb-6">
      {/* App name */}
      <div className="text-lg font-semibold">
        {t("app.name")}
      </div>

      {/* Language switcher */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => i18n.changeLanguage("pl")}
          className={`w-8 h-5 overflow-hidden rounded-[4px] border-2 transition
            ${i18n.language === "pl" ? "border-blue-500" : "border-transparent opacity-50 hover:opacity-100"}
          `}
          title="Polski"
        >
          <img
            src={plFlag}
            alt="PL"
            className="w-full h-full object-cover"
          />
        </button>

        <button
          onClick={() => i18n.changeLanguage("en")}
          className={`w-8 h-5 overflow-hidden rounded-[4px] border-2 transition
            ${i18n.language === "en" ? "border-blue-500" : "border-transparent opacity-50 hover:opacity-100"}
          `}
          title="English"
        >
          <img
            src={enFlag}
            alt="EN"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </div>

      <nav className="flex flex-col gap-2">
        {user?.role === "student" ? (
          <>
              <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/">{t("navigation.home")}</Link>
              <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/profile">{t("navigation.profile")}</Link>
              <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/payment">{t("navigation.payments")}</Link>
              <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/proposition">{t("navigation.proposition")}</Link>
          </>
        ) : 
        
        (<>
              <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/">{t("navigation.home")}</Link>
              <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/profile">{t("navigation.profile")}</Link>
              <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/creator">{t("navigation.formCreator")}</Link>
              <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/proposition">{t("navigation.proposition")}</Link>
              <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/register">{t("navigation.register")}</Link>
              <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/users">{t("navigation.users")}</Link>
        </>)}

       
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
 /*
 
 <input
      placeholder={t("common.search")}
      className="w-1/3 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300"
    />
    */

  const { filterId, setFilterId } = useFilter();
  const { t } = useTranslation();
  const {search, setSearch} = useAppContext();

  const baseClass = "px-3 py-1.5 rounded-full text-sm";
  const getClass = (number: number) =>
      filterId === number
        ? `${baseClass} text-white bg-[rgb(63,152,255)]`
        : `${baseClass} bg-gray-200 text-gray-700`;

 return (
    <div className="flex items-center justify-between mb-4">

      <input
          value={search ?? ""}
          onChange={(e)=>setSearch(e.target.value)}
          placeholder={t("common.search")}
          className="w-1/3 px-3 py-2 rounded-lg border border-gray-300"
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
    const location = useLocation();
    const hideTopBar = 
    location.pathname.includes("/proposition/") || 
    location.pathname.includes("/creator") || 
    location.pathname.includes("/form/") ||
    location.pathname.includes("/profile") ||
    location.pathname.includes("/register") ||
    location.pathname.includes("/payment"); // adjust if needed

    const [active, setActive] = useState("all");

    return(
  <div className="flex h-screen bg-gray-50">
    <Sidebar />
    <main className="flex-1 overflow-y-auto">
      <div className="p-6">
        {!hideTopBar && <TopBar />}
        <div>{children}</div>
      </div>
      </main>
      {/* MINE PREV SZYM
    <main className="flex-1 p-6">
      <TopBar />
      <div>{children}</div>
    </main> */}
  </div>
);
};
