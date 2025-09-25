import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContextBase";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

export default function AdminLayout() {
  const { role, currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex md:flex-col">
        <div className="h-16 flex items-center justify-center border-b">
          <Link to="/admin" className="text-xl font-semibold">Admin</Link>
        </div>
        <nav className="p-4 space-y-2">
          <NavLink to="/admin" end className={({ isActive }) => `block px-3 py-2 rounded ${isActive ? "bg-gray-100 font-medium" : "hover:bg-gray-100"}`}>Dashboard</NavLink>
          <NavLink to="/admin/subscribers" className={({ isActive }) => `block px-3 py-2 rounded ${isActive ? "bg-gray-100 font-medium" : "hover:bg-gray-100"}`}>Subscribers</NavLink>
          {role === "super" && (
            <NavLink to="/admin/admins" className={({ isActive }) => `block px-3 py-2 rounded ${isActive ? "bg-gray-100 font-medium" : "hover:bg-gray-100"}`}>Admins</NavLink>
          )}
        </nav>
        <div className="mt-auto p-4 border-t text-sm text-gray-600">
          <div className="mb-2 truncate">{currentUser?.email}</div>
          <div className="flex items-center justify-between">
            <span className="uppercase text-xs tracking-wider">{role}</span>
            <button onClick={() => signOut(auth)} className="text-red-600 hover:underline">Sign out</button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-4 flex items-center justify-between md:hidden">
          <div className="font-semibold">Admin</div>
          <button onClick={() => signOut(auth)} className="text-red-600">Sign out</button>
        </header>
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


