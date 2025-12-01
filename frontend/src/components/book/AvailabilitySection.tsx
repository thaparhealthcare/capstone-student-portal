import type { TimeSlot } from "@/types/booking";
import { CalendarDays, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import { HashLoader } from "react-spinners";

interface Props {
  availableDates: string[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  loadingAvailability: boolean;
  hasDoctor: boolean;
  timeSlots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
}

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function AvailabilitySection({
  availableDates,
  selectedDate,
  onSelectDate,
  loadingAvailability,
  hasDoctor,
  timeSlots,
  selectedSlot,
  onSelectSlot,
}: Props) {
  // -----------------------------
  // LIMIT: today -> today + 6 days (7 days total)
  // -----------------------------
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0); // normalize
    return d;
  }, []);

  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 6); // today + 6 = 7 days range
    d.setHours(0, 0, 0, 0);
    return d;
  }, [today]);

  // -----------------------------
  // CALENDAR STATE
  // -----------------------------
  const initialMonth = useMemo(() => {
    if (selectedDate) return selectedDate.slice(0, 7); // "YYYY-MM"
    if (availableDates.length > 0) return availableDates[0].slice(0, 7);
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  }, [selectedDate, availableDates]);

  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  const availableSet = useMemo(() => new Set(availableDates), [availableDates]);

  const [currentYearNumber, currentMonthNumber] = useMemo(() => {
    const [yearStr, monthStr] = currentMonth.split("-");
    return [parseInt(yearStr, 10), parseInt(monthStr, 10) - 1]; // month 0-based
  }, [currentMonth]);

  // Build calendar grid for currentMonth
  const calendarCells = useMemo(() => {
    const year = currentYearNumber;
    const month = currentMonthNumber;

    const firstDay = new Date(year, month, 1);
    const firstWeekday = firstDay.getDay(); // 0 (Sun) - 6 (Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: { dateStr?: string; day?: number }[] = [];

    // leading empty cells
    for (let i = 0; i < firstWeekday; i++) {
      cells.push({});
    }

    // actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      cells.push({ dateStr, day });
    }

    return cells;
  }, [currentYearNumber, currentMonthNumber]);

  const handlePrevMonth = () => {
    const year = currentYearNumber;
    const month = currentMonthNumber;
    const prev = new Date(year, month - 1, 1);
    const y = prev.getFullYear();
    const m = prev.getMonth() + 1;
    setCurrentMonth(`${y}-${String(m).padStart(2, "0")}`);
  };

  const handleNextMonth = () => {
    const year = currentYearNumber;
    const month = currentMonthNumber;
    const next = new Date(year, month + 1, 1);
    const y = next.getFullYear();
    const m = next.getMonth() + 1;
    setCurrentMonth(`${y}-${String(m).padStart(2, "0")}`);
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="space-y-4">
      {/* Calendar */}
      <div className="rounded-xl bg-white p-4 shadow-md">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
          <CalendarDays className="text-blue-600" size={18} />
          Available Dates
        </h3>

        {loadingAvailability ? (
          <div className="flex items-center justify-center py-6">
            <HashLoader size={35} color="#2563eb" />
          </div>
        ) : !hasDoctor ? (
          <p className="text-xs text-gray-500">
            Select a doctor first to view availability.
          </p>
        ) : availableDates.length === 0 ? (
          <p className="text-xs text-red-500">
            No availability added for this doctor.
          </p>
        ) : (
          <div className="space-y-3">
            {/* Calendar header */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="rounded-full border border-gray-300 p-1 hover:bg-gray-100"
              >
                <ChevronLeft size={16} />
              </button>

              <p className="text-sm font-semibold text-gray-800">
                {monthNames[currentMonthNumber]} {currentYearNumber}
              </p>

              <button
                type="button"
                onClick={handleNextMonth}
                className="rounded-full border border-gray-300 p-1 hover:bg-gray-100"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Weekday header */}
            <div className="grid grid-cols-7 text-center text-[11px] font-medium text-gray-500">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* Calendar cells */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {calendarCells.map((cell, idx) => {
                if (!cell.dateStr || cell.day == null) {
                  return (
                    <div key={idx} className="h-8 text-xs text-gray-300" />
                  );
                }

                const cellDate = new Date(cell.dateStr);
                cellDate.setHours(0, 0, 0, 0);

                const inAvailableList = availableSet.has(cell.dateStr);
                const isPast = cellDate < today;
                const isBeyondRange = cellDate > maxDate;
                const isWithinRange = !isPast && !isBeyondRange;

                const isSelected = selectedDate === cell.dateStr;
                const baseClasses =
                  "h-8 flex items-center justify-center rounded-full text-xs";

                // 🩶 Past dates (before today) -> grey
                if (isPast) {
                  return (
                    <div
                      key={cell.dateStr}
                      className={`${baseClasses} border border-gray-200 bg-gray-100 text-gray-400`}
                    >
                      {cell.day}
                    </div>
                  );
                }

                // 🩶 Future but beyond 7-day limit -> grey
                if (isBeyondRange) {
                  return (
                    <div
                      key={cell.dateStr}
                      className={`${baseClasses} border border-gray-200 bg-gray-100 text-gray-300`}
                    >
                      {cell.day}
                    </div>
                  );
                }

                // Now we are within allowed booking window (today..maxDate)

                // ❌ Not available within allowed range -> RED
                if (!inAvailableList && isWithinRange) {
                  return (
                    <div
                      key={cell.dateStr}
                      className={`${baseClasses} border border-red-300 bg-red-100 text-red-600`}
                    >
                      {cell.day}
                    </div>
                  );
                }

                // ✅ Available within range -> GREEN (clickable)
                return (
                  <button
                    key={cell.dateStr}
                    type="button"
                    onClick={() => onSelectDate(cell.dateStr!)}
                    className={`${baseClasses} border transition ${
                      isSelected
                        ? "border-green-600 bg-green-600 text-white"
                        : "border-green-400 bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>

            <p className="mt-1 text-[11px] text-gray-400">
              * You can book appointments for up to 7 days from today.
            </p>
          </div>
        )}
      </div>

      {/* Time Slots */}
      <div className="rounded-xl bg-white p-4 shadow-md">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Clock className="text-blue-600" size={18} />
          Available Time Slots
        </h3>

        {!hasDoctor ? (
          <p className="text-xs text-gray-500">
            Select a doctor and date to see slots.
          </p>
        ) : !selectedDate ? (
          <p className="text-xs text-gray-500">
            Pick a date to view time slots.
          </p>
        ) : timeSlots.length === 0 ? (
          <p className="text-xs text-red-500">
            No time slots available for this date.
          </p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-3">
            {timeSlots.map((slot, idx) => {
              const key = `${slot.start.toISOString()}-${idx}`;
              const isSelected =
                selectedSlot &&
                selectedSlot.start.getTime() === slot.start.getTime() &&
                selectedSlot.end.getTime() === slot.end.getTime();

              return (
                <button
                  key={key}
                  onClick={() => onSelectSlot(slot)}
                  className={`rounded-lg border px-3 py-2 text-xs transition ${
                    isSelected
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  {formatTime(slot.start)} - {formatTime(slot.end)}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
