import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../App";

const Sidebar = () => {
  const { setUser } = useAppContext();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
      <div className="text-lg font-semibold mb-6">E-Dziekanat</div>

      <nav className="flex flex-col gap-2">
        <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/">Home</Link>
        <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/profile">Profile</Link>
        <Link className="px-3 py-2 rounded-lg hover:bg-gray-100" to="/form">Form</Link>
      </nav>

      <button
        className="mt-auto px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100"
        onClick={() => {
          fetch('http://localhost:8080/user/logout',
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

const TopBar = () => (
  <div className="flex items-center justify-between mb-4">
    <input
      placeholder="Search..."
      className="w-1/3 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300"
    />

    <div className="flex gap-2">
      <button className="px-3 py-1.5 rounded-full text-white bg-[rgb(63,152,255)] text-sm">Wszystkie ✓</button>
      <button className="px-3 py-1.5 rounded-full bg-gray-200 text-gray-700 text-sm">Zaakceptowane</button>
      <button className="px-3 py-1.5 rounded-full bg-gray-200 text-gray-700 text-sm">Oczekujące</button>
    </div>
  </div>
);

export const Layout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar />
    <main className="flex-1 p-6">
      <TopBar />
      {children}
    </main>
  </div>
);
