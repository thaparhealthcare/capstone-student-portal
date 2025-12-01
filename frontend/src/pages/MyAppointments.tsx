import type { Appointment, AppointmentStatus } from "@/types/appointment";
import { CalendarDays, Clock, Stethoscope, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { HashLoader } from "react-spinners";
import { toast } from "sonner";
import { appointmentApi } from "../api/appointmentApi";
import { studentApi } from "../api/studentApi";
import DashboardLayout from "./DashboardLayout";

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// fallback endTime if backend missing
const getEndTimeISO = (startIso: string): string => {
  const d = new Date(startIso);
  d.setMinutes(d.getMinutes() + 30);
  return d.toISOString();
};

const statusColors: Record<
  AppointmentStatus,
  { bg: string; text: string; label: string }
> = {
  PENDING: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    label: "Pending",
  },
  CONFIRMED: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    label: "Confirmed",
  },
  COMPLETED: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    label: "Completed",
  },
  CANCELLED: {
    bg: "bg-red-100",
    text: "text-red-700",
    label: "Cancelled",
  },
};

export default function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "UPCOMING" | "PAST">("ALL");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await studentApi.getAppointments();
        setAppointments(res.data || []);
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message || "Failed to load appointments"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancel = async (id: string, status: AppointmentStatus) => {
    if (status === "CANCELLED" || status === "COMPLETED") {
      toast.info("This appointment cannot be cancelled.");
      return;
    }

    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      setCancellingId(id);
      await appointmentApi.cancelAppointment(id);

      toast.success("Appointment cancelled successfully!");

      // update UI
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === id ? { ...appt, status: "CANCELLED" } : appt
        )
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to cancel appointment"
      );
    } finally {
      setCancellingId(null);
    }
  };

  const filteredAppointments = useMemo(() => {
    if (filter === "ALL") return appointments;

    const now = new Date();
    return appointments.filter((appt) => {
      const date = new Date(appt.appointmentDate);
      if (filter === "UPCOMING") return date >= now;
      if (filter === "PAST") return date < now;
      return true;
    });
  }, [appointments, filter]);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
            <CalendarDays className="text-blue-600" />
            My Appointments
          </h1>

          {/* Filter buttons */}
          <div className="flex gap-2 text-xs sm:text-sm">
            {["ALL", "UPCOMING", "PAST"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as "ALL" | "UPCOMING" | "PAST")}
                className={`rounded-full border px-3 py-1 transition ${
                  filter === f
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-blue-50"
                }`}
              >
                {f === "ALL" ? "All" : f === "UPCOMING" ? "Upcoming" : "Past"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center">
            <HashLoader color="#2563eb" />
            <p className="mt-3 text-gray-600">Loading your appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-md">
            <p className="text-sm text-gray-600">
              You don&apos;t have any appointments yet.
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Book an appointment from the &quot;Book Appointment&quot; page.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAppointments.map((appt) => {
              const statusStyle = statusColors[appt.status];
              const endIso =
                appt.endTime || getEndTimeISO(appt.appointmentDate);

              return (
                <div
                  key={appt._id}
                  className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-md sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* left info */}
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                        <Stethoscope size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {appt.doctorId?.name ?? "Doctor"}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {appt.doctorId?.specialization ?? "General"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={14} />
                        {formatDateTime(appt.appointmentDate)}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatTime(appt.appointmentDate)} –{" "}
                        {formatTime(endIso)}
                      </span>

                      <span
                        className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        {statusStyle.label}
                      </span>
                    </div>

                    {appt.reason && (
                      <p className="mt-1 text-xs text-gray-500">
                        <span className="font-semibold">Reason:</span>{" "}
                        {appt.reason}
                      </p>
                    )}

                    {appt.notes && (
                      <p className="mt-0.5 text-xs text-gray-500">
                        <span className="font-semibold">
                          Doctor&apos;s Notes:
                        </span>{" "}
                        {appt.notes}
                      </p>
                    )}
                  </div>

                  {/* Right side Actions */}
                  <div className="flex flex-col items-end gap-2">
                    {/* CANCEL BUTTON */}
                    {appt.status !== "CANCELLED" &&
                      appt.status !== "COMPLETED" && (
                        <button
                          onClick={() => handleCancel(appt._id, appt.status)}
                          disabled={cancellingId === appt._id}
                          className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-red-600 disabled:bg-red-300"
                        >
                          {cancellingId === appt._id ? (
                            "Cancelling..."
                          ) : (
                            <>
                              <XCircle size={14} /> Cancel
                            </>
                          )}
                        </button>
                      )}

                    <p className="text-[10px] text-gray-400">
                      Booked on: {formatDateTime(appt.createdAt)?.split(",")[0]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
