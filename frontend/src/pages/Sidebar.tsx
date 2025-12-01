import { Button } from "@/components/ui/button";
import {
  Calendar,
  ClipboardList,
  Home,
  Info,
  LogOut,
  User,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "../api/authApi";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      toast.success("Logged out successfully!");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Logout failed!");
    }
  };

  const linkClass = (isActive: boolean) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 
     ${
       isActive
         ? "bg-slate-800 text-white shadow-md shadow-slate-800/50"
         : "hover:bg-slate-800/40 hover:scale-[1.03] hover:text-white"
     }`;

  return (
    <div className="fixed top-0 left-0 flex h-screen w-64 flex-col bg-slate-900 text-slate-300 shadow-xl">
      {/* Logo + Name */}
      <div className="flex items-center gap-3 border-b border-slate-700 px-6 py-7">
        <img
          src="/logo.png"
          alt="TIET Logo"
          className="h-12 w-12 rounded-3xl object-contain drop-shadow-md"
        />
        <div>
          <h1 className="text-xl font-bold tracking-wide text-white">
            Student Portal
          </h1>
          <p className="mt-0.5 text-xs text-slate-400">TIET Health Center</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-1 flex-col space-y-2 px-4 py-6">
        <NavLink to="/dashboard">
          {({ isActive }) => (
            <div className={linkClass(isActive)}>
              <Home size={18} /> Dashboard
            </div>
          )}
        </NavLink>

        <NavLink to="/appointments">
          {({ isActive }) => (
            <div className={linkClass(isActive)}>
              <Calendar size={18} /> My Appointments
            </div>
          )}
        </NavLink>

        <NavLink to="/book-appointment">
          {({ isActive }) => (
            <div className={linkClass(isActive)}>
              <ClipboardList size={18} /> Book Appointment
            </div>
          )}
        </NavLink>
        <NavLink
          to="/staff"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
              isActive ? "bg-slate-800 text-white" : "hover:bg-slate-800/40"
            }`
          }
        >
          <User size={18} /> Doctors & Staff
        </NavLink>

        <NavLink
          to="/info"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
              isActive ? "bg-slate-800 text-white" : "hover:bg-slate-800/40"
            }`
          }
        >
          <Info size={18} /> OPD & Instructions
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div className="border-t border-slate-700 px-4 py-5">
        <Button
          onClick={handleLogout}
          variant="default"
          className="w-full bg-slate-800 text-white hover:bg-slate-700/80"
        >
          <LogOut size={18} /> Logout
        </Button>
      </div>
    </div>
  );
}
