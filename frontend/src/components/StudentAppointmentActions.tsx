import { appointmentApi } from "@/api/appointmentApi";
import { XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  appointmentId: string;
  status: string;
  onStatusChange?: (newStatus: string) => void;
}

export default function StudentAppointmentActions({
  appointmentId,
  status,
  onStatusChange,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (status === "CANCELLED" || status === "COMPLETED") {
      toast.info("This appointment cannot be cancelled.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await appointmentApi.updateStatus(appointmentId, "CANCELLED");
      toast.success("Appointment cancelled successfully!");
      if (onStatusChange) onStatusChange("CANCELLED");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to cancel appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  if (status === "CANCELLED" || status === "COMPLETED") return null;

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:bg-red-50"
    >
      <XCircle size={14} />
      {loading ? "Cancelling..." : "Cancel"}
    </button>
  );
}
