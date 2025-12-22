import axiosClient from "@/api/axiosClient";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "./DashboardLayout";

interface TimeRange {
  startTime: string;
  endTime: string;
}

interface Availability {
  _id: string;
  doctor: string;
  date: string;
  isLeave: boolean;
  timeRanges: TimeRange[];
}

interface Props {
  doctorId: string;
}

export default function DoctorAvailability({ doctorId }: Props) {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- HELPERS ---------------- */
  const toYMD = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  /* ---------------- FETCH AVAILABILITY ---------------- */
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await axiosClient.get(
          `/api/doctor/${doctorId}/availability`
        );
        setAvailability(res.data || []);
      } catch (err: any) {
        toast.error("Failed to load availability");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [doctorId]);

  /* ---------------- MAP DATA ---------------- */
  const availabilityMap = useMemo(() => {
    const map: Record<string, { isLeave: boolean; timeRanges: TimeRange[] }> =
      {};

    availability.forEach((item) => {
      map[toYMD(item.date)] = {
        isLeave: item.isLeave,
        timeRanges: item.timeRanges || [],
      };
    });

    return map;
  }, [availability]);

  /* ---------------- CALENDAR LOGIC ---------------- */
  const currentMonth = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  /* ---------------- UI ---------------- */
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-4 text-2xl font-bold">Doctor Availability</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* CALENDAR */}
            <div className="rounded-xl bg-white p-4 shadow">
              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div
                    key={d}
                    className="text-center text-sm font-medium text-gray-500"
                  >
                    {d}
                  </div>
                ))}

                {Array(startDay)
                  .fill(null)
                  .map((_, i) => (
                    <div key={i} />
                  ))}

                {Array(daysInMonth)
                  .fill(null)
                  .map((_, i) => {
                    const dateObj = new Date(year, month, i + 1);
                    const ymd = toYMD(dateObj.toISOString());
                    const data = availabilityMap[ymd];
                    const isPast = isPastDate(dateObj);

                    let style = "bg-gray-200 text-gray-400 cursor-not-allowed";

                    if (!isPast && data) {
                      style = data.isLeave
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-700";
                    }

                    if (!isPast && !data) {
                      style = "bg-gray-100 text-gray-500";
                    }

                    return (
                      <button
                        key={ymd}
                        disabled={isPast || data?.isLeave}
                        onClick={() => setSelectedDate(ymd)}
                        className={`h-12 rounded-lg text-sm font-semibold ${style}`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* TIME SLOTS */}
            {selectedDate && (
              <div className="mt-6 rounded-xl bg-white p-4 shadow">
                <h2 className="mb-3 font-semibold">
                  Available Slots — {selectedDate}
                </h2>

                <div className="flex flex-wrap gap-3">
                  {availabilityMap[selectedDate]?.timeRanges.map((t, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-blue-100 px-4 py-2 text-sm text-blue-700"
                    >
                      {t.startTime} – {t.endTime}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
