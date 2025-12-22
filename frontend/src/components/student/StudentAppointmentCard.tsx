import { Calendar, Clock, User } from "lucide-react";

export default function StudentAppointmentCard({ appointment }: any) {
  const statusColor =
    appointment.status === "completed"
      ? "bg-green-100 text-green-700"
      : appointment.status === "cancelled"
        ? "bg-red-100 text-red-700"
        : "bg-blue-100 text-blue-700";

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <User size={18} />
          Dr. {appointment.doctor?.name}
        </h3>

        <span className={`rounded-full px-3 py-1 text-sm ${statusColor}`}>
          {appointment.status.toUpperCase()}
        </span>
      </div>

      <div className="mt-3 space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          {appointment.date}
        </div>

        <div className="flex items-center gap-2">
          <Clock size={16} />
          {appointment.startTime} – {appointment.endTime}
        </div>

        <p className="mt-2 rounded-lg bg-gray-50 p-3 text-gray-700">
          <strong>Reason:</strong> {appointment.reason}
        </p>
      </div>
    </div>
  );
}
