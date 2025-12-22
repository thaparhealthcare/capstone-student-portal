import { appointmentApi } from "@/api/appointmentApi";
import { availabilityApi } from "@/api/availabilityApi";
import { doctorApi } from "@/api/doctorApi";
import DoctorSelector from "@/components/book/DoctorSelector";
import AvailabilityCalendar from "@/components/calendar/AvailabilityCalendar";
import TimeRangeModal from "@/components/calendar/TimeRangeModal";
import { Calendar, Clock, Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardLayout from "../DashboardLayout";

/* Types */
interface TimeRange {
  startTime: string;
  endTime: string;
}

interface Availability {
  _id?: string;
  date: string;
  isLeave: boolean;
  timeRanges: TimeRange[];
}

export default function BookAppointment() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);

  // Selection States
  const [selectedAvailability, setSelectedAvailability] =
    useState<Availability | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeRange | null>(null);
  const [reason, setReason] = useState("");

  const handleConfirmBooking = async () => {
    if (!selectedDoctorId || !selectedAvailability || !selectedSlot) {
      toast.error("Incomplete booking details");
      return;
    }

    try {
      await appointmentApi.bookAppointment({
        doctorId: selectedDoctorId,
        date: selectedAvailability.date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        reason,
      });

      toast.success("Appointment booked successfully", {
        onClose: () => {
          setSelectedAvailability(null);
          setSelectedSlot(null);
          setReason("");
          navigate("/appointments");
        },
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to book appointment");
    }
  };
  /* Load Doctors */
  useEffect(() => {
    doctorApi
      .getAllDoctors()
      .then((res) => setDoctors(res.data || []))
      .catch(() => toast.error("Failed to load doctors"));
  }, []);

  /* Handle Doctor Selection */
  const handleDoctorSelect = async (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setSelectedAvailability(null);
    setSelectedSlot(null);
    setReason("");
    setAvailability([]);

    try {
      const res = await availabilityApi.getDoctorAvailability(doctorId);
      setAvailability(res.data || []);
    } catch {
      toast.error("Failed to load availability");
    }
  };

  /* Open Modal for Change */
  const handleChangeSlot = () => {
    // Just re-open the modal with the current selected availability
    if (selectedAvailability) {
      // logic is already handled because modal opens when selectedAvailability is set
      // We just need to ensure we don't nullify it.
      // The modal is controlled by `!!selectedAvailability`, so it's likely already open unless we closed it.
      // Wait, we close it on select. So we just need to ensure state is valid.
      // The modal logic below: open={!!selectedAvailability && !selectedSlot} is WRONG if we want to change.
      // Correct Logic: Use a separate 'isModalOpen' or just rely on selectedAvailability and manually close.
    }
    // Simplest way: Set slot to null, keep availability. This re-triggers modal flow.
    setSelectedSlot(null);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl pb-20">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">
          Book Appointment
        </h1>

        {/* 1. Select Doctor */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-700">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
              1
            </span>
            Select Doctor
          </h2>
          <DoctorSelector
            doctors={doctors}
            selectedDoctorId={selectedDoctorId}
            onSelectDoctor={handleDoctorSelect}
          />
        </section>

        {/* 2. Select Date (Only after doctor is selected) */}
        {selectedDoctorId && (
          <section className="animate-in fade-in slide-in-from-bottom-4 mt-8 duration-500">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                2
              </span>
              Select Date
            </h2>
            <AvailabilityCalendar
              availability={availability}
              selectedDateStr={selectedAvailability?.date}
              onDateClick={(a) => {
                setSelectedAvailability(a);
                setSelectedSlot(null); // Reset slot to open modal
              }}
            />
          </section>
        )}

        {/* Modal Logic: Open if Availability Selected BUT Slot NOT Selected */}
        <TimeRangeModal
          open={!!selectedAvailability && !selectedSlot}
          date={selectedAvailability?.date}
          isLeave={selectedAvailability?.isLeave}
          timeRanges={selectedAvailability?.timeRanges || []}
          onSelectSlot={(slot) => {
            setSelectedSlot(slot);
            // We keep selectedAvailability true so we can reference date, but modal closes because !selectedSlot becomes false
          }}
          onClose={() => setSelectedAvailability(null)}
        />

        {/* 3. Final Details (Only after Slot is selected) */}
        {selectedSlot && selectedAvailability && (
          <section className="animate-in fade-in slide-in-from-bottom-8 mt-10 duration-500">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                3
              </span>
              Confirm Details
            </h2>

            <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
              {/* Time Summary */}
              <div className="mb-6 flex flex-col justify-between rounded-xl border border-gray-100 bg-gray-50 p-5 sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>{selectedAvailability.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
                    <Clock size={20} className="text-blue-600" />
                    <span>
                      {selectedSlot.startTime} - {selectedSlot.endTime}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleChangeSlot}
                  className="mt-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 hover:text-blue-800 sm:mt-0"
                >
                  <Edit2 size={14} />
                  Change Time
                </button>
              </div>

              {/* Reason Input Box */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Reason for Visit <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Feeling feverish since last night..."
                  className="h-32 w-full resize-none rounded-xl border border-gray-300 p-4 text-gray-700 shadow-sm transition outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-2 text-right text-xs text-gray-400">
                  {reason.length}/200 characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleConfirmBooking}
                disabled={!reason.trim()}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-lg font-bold shadow-lg transition-all active:scale-[0.99] ${
                  !reason.trim()
                    ? "cursor-not-allowed bg-gray-100 text-gray-400 shadow-none"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200"
                }`}
              >
                Confirm Appointment
              </button>
            </div>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
