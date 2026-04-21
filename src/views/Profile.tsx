import { useAppContext } from "../App";

export const ProfileView = () => {
  const { user } = useAppContext();
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p className="text-gray-600 mt-2">Welcome, {user}</p>
    </div>
  );
};