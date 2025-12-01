import {
  Calendar,
  Cross,
  Droplets,
  Hotel,
  Mail,
  Phone,
  School,
} from "lucide-react";
import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
import { toast } from "sonner";
import { authApi } from "../api/authApi";
import { studentApi } from "../api/studentApi";
import { getAvatarURL } from "../utils/avatar";
import DashboardLayout from "./DashboardLayout";

export default function Dashboard() {
  const [student, setStudent] = useState<any>(null);

  // Profile loading
  const [loading, setLoading] = useState(true);

  // Password update states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [updating, setUpdating] = useState(false);

  // Accordion toggle
  const [showUpdate, setShowUpdate] = useState(true);

  // Handle password update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirm) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    if (oldPassword === newPassword) {
      toast.error("New password cannot be same as current");
      return;
    }

    try {
      setUpdating(true);
      await studentApi.updatePassword(oldPassword, newPassword);
      toast.success("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
      setShowUpdate(false); // collapse accordion
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update password");
    } finally {
      setUpdating(false);
    }
  };

  // Fetch logged-in student
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await authApi.getLoggedInStudent();
        setStudent(res.data);
      } catch {
        toast.error("Failed to load profile information");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  // Show loader
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <HashLoader color="#2563eb" />
          <p className="mt-4 text-lg text-gray-600">Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  // MAIN UI
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="mt-2 flex items-center gap-6 rounded-xl bg-white p-6 shadow-md">
          {/* Avatar */}
          <div className="h-24 w-24 overflow-hidden rounded-full shadow-lg">
            <img
              src={getAvatarURL(student.name, student.gender)}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Basic Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{student.name}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Roll Number: {student.rollNumber}
            </p>
            <p className="text-sm text-gray-500">
              Department: {student.department}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          {/* Personal Details */}
          <div className="space-y-3 rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-1 text-lg font-semibold text-gray-700">
              Personal Details
            </h2>

            <div className="flex items-center gap-3 text-gray-700">
              <div className="rounded-full bg-orange-200 p-2">
                <Mail size={18} className="text-orange-600" />
              </div>
              <span>Email: </span>
              <span className="font-medium">{student.email}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <div className="rounded-full bg-blue-200 p-2">
                <Phone size={18} className="text-blue-600" />
              </div>
              <span>Phone Number: </span>
              <span className="font-medium">{student.phone}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <div className="rounded-full bg-red-200 p-2">
                <Droplets size={18} className="text-red-600" />
              </div>
              <span>Blood Group: </span>
              <span className="font-medium">{student.bloodGroup}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <div className="rounded-full bg-indigo-200 p-2">
                <Cross size={18} className="text-indigo-600" />
              </div>
              <span>Emergency Contact: </span>
              <span className="font-medium">
                {student.emergencyContact || "N/A"}
              </span>
            </div>
          </div>

          {/* Academic Details */}
          <div className="space-y-3 rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-1 text-lg font-semibold text-gray-700">
              Academic Details
            </h2>

            <div className="flex items-center gap-3 text-gray-700">
              <div className="rounded-full bg-green-200 p-2">
                <School size={18} className="text-green-600" />
              </div>
              <span>Year of Study: </span>
              <span className="font-medium">{student.yearOfStudy}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <div className="rounded-full bg-rose-200 p-2">
                <Hotel size={18} className="text-rose-600" />
              </div>
              <span>Hostel: </span>
              <span className="font-medium">{student.hostel || "N/A"}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <div className="rounded-full bg-violet-200 p-2">
                <Calendar size={18} className="text-violet-600" />
              </div>
              <span>Room: </span>
              <span className="font-medium">{student.roomNumber || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Accordion for Update Password */}
        <div className="mx-auto mt-6">
          <div className="rounded-xl border border-gray-200 bg-white shadow-md">
            {/* Accordion Header */}
            <button
              type="button"
              className="flex w-full items-center justify-between px-5 py-4"
            >
              <span className="text-sm font-semibold text-gray-800">
                Update Password
              </span>
            </button>

            {/* Divider */}
            {showUpdate && <div className="border-t border-gray-200" />}

            {/* Accordion Content */}
            {showUpdate && (
              <div className="px-5 py-2">
                <form onSubmit={handleSubmit} className="w-full space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={updating}
                      className="m my-2 w-fit rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-400"
                    >
                      {updating ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
