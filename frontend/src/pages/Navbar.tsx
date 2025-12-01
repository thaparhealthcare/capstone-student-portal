import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "../api/authApi";
import { getAvatarURL } from "../utils/avatar";

export default function Navbar() {
  const [student, setStudent] = useState<any>(null);
  const location = useLocation();

  // Dynamic title based on page
  const pageTitle = (() => {
    return "";
  })();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await authApi.getLoggedInStudent();
        setStudent(res.data);
      } catch {
        toast.error("Failed to load user info");
      }
    };

    fetchStudent();
  }, []);

  return (
    <div className="fixed top-0 right-0 left-64 z-10 flex h-16 items-center justify-between bg-white px-6 shadow-md">
      {/* Page Title */}
      <h2 className="text-xl font-semibold text-slate-700">{pageTitle}</h2>

      {/* User info */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-700">
            {student?.name ?? "Loading..."}
          </p>
          <p className="text-xs text-slate-500">{student?.rollNumber}</p>
        </div>

        {/* Avatar */}
        <div className="h-10 w-10 overflow-hidden rounded-full shadow">
          <img
            src={getAvatarURL(student?.name, student?.gender)}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
