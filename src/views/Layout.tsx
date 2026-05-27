import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext, useFilter } from "../App";

const Sidebar = () => {
  const { setUser } = useAppContext();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
      <div className="text-lg font-semibold mb-6">E-Dziekanat</div>

      <nav className="flex flex-col gap-2">
        <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/">Home</Link>
        <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/profile">Profile</Link>
        <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/form">Form</Link>
        <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/forms">Forms</Link>
        <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/creator">Form Creator</Link>
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
        Logout
      </button>
    </aside>
  );
};


const TopBar = () => {
 const { filterId, setFilterId } = useFilter();

const baseClass = "px-3 py-1.5 rounded-full text-sm";
const getClass = (number: number) =>
    filterId === number
      ? `${baseClass} text-white bg-[rgb(63,152,255)]`
      : `${baseClass} bg-gray-200 text-gray-700`;

 return (
  <div className="flex items-center justify-between mb-4">
    <input
      placeholder="Search..."
      className="w-1/3 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300"
    />

    <div className="flex gap-2">
      <button className={getClass(-1)} onClick={() => setFilterId(-1)}>Wszystkie {filterId === -1 && "✓"}  </button>
      <button className={getClass(0)} onClick={() => setFilterId(0)}> Zaakceptowane {filterId === 0 && "✓"} </button>
      <button className={getClass(1)} onClick={() => setFilterId(1)}>Oczekujące {filterId === 1 && "✓"}  </button>
      <button className={getClass(2)} onClick={() => setFilterId(2)}>Odrzucone {filterId === 2 && "✓"} </button>
      <button className={getClass(3)} onClick={() => setFilterId(3)}>Niewysłane {filterId === 3 && "✓"}  </button>
      <button className={getClass(4)} onClick={() => setFilterId(4)}>Wymagające aktualizacji {filterId === 4 && "✓"}  </button>
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
