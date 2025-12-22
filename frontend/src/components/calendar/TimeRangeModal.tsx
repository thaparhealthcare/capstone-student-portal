import { AlertCircle, CalendarCheck, Clock, X } from "lucide-react";
import { useEffect, useState } from "react";

interface TimeRange {
  startTime: string;
  endTime: string;
}

interface Props {
  open: boolean;
  isLeave?: boolean;
  date?: string;
  timeRanges: TimeRange[];
  onSelectSlot: (slot: TimeRange) => void;
  onClose: () => void;
}

/* Helpers */
const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const toTime = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 || 12;
  return `${String(displayH).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
};

const to24Hour = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const generateSlots = (ranges: TimeRange[]) => {
  const slots: { display: string; apiStart: string; apiEnd: string }[] = [];
  ranges.forEach((r) => {
    let start = toMinutes(r.startTime);
    const end = toMinutes(r.endTime);
    while (start + 30 <= end) {
      slots.push({
        display: `${toTime(start)} - ${toTime(start + 30)}`,
        apiStart: to24Hour(start),
        apiEnd: to24Hour(start + 30),
      });
      start += 30;
    }
  });
  return slots;
};

/* OPD Logic */
const getOPDInfo = (dateString: string) => {
  const day = new Date(dateString).getDay();
  if (day === 0) {
    // Sun
    return {
      text: "Sunday: 10:00 AM - 2:00 PM",
      ranges: [{ startTime: "10:00", endTime: "14:00" }],
    };
  }
  if (day === 6) {
    // Sat
    return {
      text: "Saturday: 10am - 2pm & 3pm - 7pm",
      ranges: [
        { startTime: "10:00", endTime: "14:00" },
        { startTime: "15:00", endTime: "19:00" },
      ],
    };
  }
  // Mon-Fri
  return {
    text: "Mon - Fri: 8:30 AM - 6:00 PM",
    ranges: [{ startTime: "08:30", endTime: "18:00" }],
  };
};

export default function TimeRangeModal({
  open,
  isLeave,
  date,
  timeRanges,
  onSelectSlot,
  onClose,
}: Props) {
  const [activeSlots, setActiveSlots] = useState<
    { display: string; apiStart: string; apiEnd: string }[]
  >([]);

  useEffect(() => {
    if (open && date && !isLeave) {
      const isCustom = timeRanges && timeRanges.length > 0;
      const opdInfo = !isCustom ? getOPDInfo(date) : null;
      const rangesToUse = isCustom ? timeRanges : opdInfo?.ranges || [];
      setActiveSlots(generateSlots(rangesToUse));
    }
  }, [open, date, isLeave, timeRanges]);

  if (!open || !date) return null;

  const isCustom = timeRanges && timeRanges.length > 0;
  const opdInfo = !isCustom ? getOPDInfo(date) : null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gray-50 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Select Time Slot
            </h3>
            <p className="mt-1 text-xs text-gray-500">{date}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-gray-200"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="custom-scrollbar overflow-y-auto p-6">
          {/* LEAVE CASE */}
          {isLeave ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
                <AlertCircle size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-800">Unavailable</h4>
              <p className="mt-2 text-gray-500">
                Doctor is on leave for this date.
              </p>
              <button
                onClick={onClose}
                className="mt-6 rounded-lg bg-gray-100 px-6 py-2 font-medium text-gray-700 hover:bg-gray-200"
              >
                Choose another date
              </button>
            </div>
          ) : (
            <>
              {/* Info Banner */}
              <div
                className={`mb-6 flex gap-3 rounded-xl border p-4 ${isCustom ? "border-blue-100 bg-blue-50 text-blue-800" : "border-emerald-100 bg-emerald-50 text-emerald-800"}`}
              >
                {isCustom ? (
                  <Clock className="shrink-0" />
                ) : (
                  <CalendarCheck className="shrink-0" />
                )}
                <div>
                  <h4 className="text-sm font-bold">
                    {isCustom ? "Limited Hours Available" : "Standard Schedule"}
                  </h4>
                  {!isCustom && (
                    <p className="mt-1 text-xs opacity-90">{opdInfo?.text}</p>
                  )}
                </div>
              </div>

              {/* Slots Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {activeSlots.map((s, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      onSelectSlot({ startTime: s.apiStart, endTime: s.apiEnd })
                    }
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 focus:ring-2 focus:ring-blue-200"
                  >
                    {s.display}
                  </button>
                ))}
              </div>
              {activeSlots.length === 0 && (
                <p className="py-4 text-center text-gray-500">
                  No slots available.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
