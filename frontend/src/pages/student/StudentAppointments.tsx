import { studentAppointmentApi } from "@/api/studentAppointment";
import StudentAppointmentCard from "@/components/student/StudentAppointmentCard";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../DashboardLayout";

export default function StudentAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filter, setFilter] = useState<"upcoming" | "past" | "all">("upcoming");

  const loadAppointments = async () => {
    try {
      let res;

      if (filter === "all") {
        res = await studentAppointmentApi.getAll();
      } else if (filter === "past") {
        res = await studentAppointmentApi.getPast();
      } else {
        res = await studentAppointmentApi.getUpcoming();
      }

      setAppointments(res.data.appointments || []);
    } catch {
      toast.error("Failed to load appointments");
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [filter]);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl pb-20">
        <h1 className="mb-6 text-3xl font-bold">My Appointments</h1>

        {/* FILTER TABS */}
        <div className="mb-6 flex gap-3">
          {["upcoming", "past", "all"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t as any)}
              className={`rounded-lg px-4 py-2 font-medium ${
                filter === t
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {appointments.length === 0 && (
            <div className="rounded-xl bg-gray-50 p-6 text-center text-gray-500">
              No appointments found
            </div>
          )}

          {appointments.map((a) => (
            <StudentAppointmentCard key={a._id} appointment={a} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
