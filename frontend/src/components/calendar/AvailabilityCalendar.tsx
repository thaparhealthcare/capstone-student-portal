// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useState } from "react";
// import { toast } from "react-toastify";

// /* Types */
// interface Availability {
//   _id?: string;
//   date: string;
//   isLeave: boolean;
//   timeRanges: { startTime: string; endTime: string }[];
// }

// interface Props {
//   availability: Availability[];
//   onDateClick: (a: Availability) => void;
//   selectedDateStr?: string; // To highlight selected date
// }

// export default function AvailabilityCalendar({
//   availability,
//   onDateClick,
//   selectedDateStr,
// }: Props) {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

//   /* --- Navigation --- */
//   const nextMonth = () => {
//     setCurrentMonthDate(
//       new Date(
//         currentMonthDate.getFullYear(),
//         currentMonthDate.getMonth() + 1,
//         1
//       )
//     );
//   };

//   const prevMonth = () => {
//     const newDate = new Date(
//       currentMonthDate.getFullYear(),
//       currentMonthDate.getMonth() - 1,
//       1
//     );
//     if (
//       newDate.getMonth() < today.getMonth() &&
//       newDate.getFullYear() === today.getFullYear()
//     ) {
//       return;
//     }
//     setCurrentMonthDate(newDate);
//   };

//   /* --- Data Map --- */
//   const availabilityMap: Record<string, Availability> = {};
//   availability.forEach((a) => {
//     availabilityMap[a.date] = a;
//   });

//   const year = currentMonthDate.getFullYear();
//   const month = currentMonthDate.getMonth();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const startDay = new Date(year, month, 1).getDay();

//   /* --- Click Logic --- */
//   const handleClick = (day: number) => {
//     const isoDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
//       day
//     ).padStart(2, "0")}`;
//     const dateObj = new Date(year, month, day);

//     if (dateObj < today) {
//       toast.error("Cannot select past dates");
//       return;
//     }

//     // Default: If no data, assume "Available" (Standard OPD)
//     const finalData: Availability = availabilityMap[isoDate] || {
//       date: isoDate,
//       isLeave: false,
//       timeRanges: [],
//     };

//     onDateClick(finalData);
//   };

//   return (
//     <div className="mt-6 flex w-full justify-center">
//       <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
//         {/* Header */}
//         <div className="mb-6 flex items-center justify-between">
//           <h2 className="text-lg font-bold text-gray-800">
//             {currentMonthDate.toLocaleString("default", { month: "long" })}{" "}
//             {year}
//           </h2>
//           <div className="flex gap-2">
//             <button
//               onClick={prevMonth}
//               className="rounded-full bg-gray-50 p-2 text-gray-600 transition hover:bg-gray-200"
//             >
//               <ChevronLeft size={20} />
//             </button>
//             <button
//               onClick={nextMonth}
//               className="rounded-full bg-gray-50 p-2 text-gray-600 transition hover:bg-gray-200"
//             >
//               <ChevronRight size={20} />
//             </button>
//           </div>
//         </div>

//         {/* Days Header */}
//         <div className="mb-4 grid grid-cols-7 place-items-center text-xs font-semibold tracking-wide text-gray-400 uppercase">
//           {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//             <div key={d}>{d}</div>
//           ))}
//         </div>

//         {/* Calendar Grid - ALIGNMENT FIXED */}
//         <div className="grid grid-cols-7 place-items-center gap-y-4">
//           {/* Empty Slots */}
//           {Array(startDay)
//             .fill(null)
//             .map((_, i) => (
//               <div key={`empty-${i}`} />
//             ))}

//           {/* Days */}
//           {Array(daysInMonth)
//             .fill(null)
//             .map((_, i) => {
//               const day = i + 1;
//               const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(
//                 day
//               ).padStart(2, "0")}`;
//               const dateObj = new Date(year, month, day);
//               const isPast = dateObj < today;
//               const data = availabilityMap[iso];

//               // Colors Logic
//               let colorClass =
//                 "bg-emerald-200 text-emerald-700 hover:bg-emerald-100 ring-1 ring-emerald-100"; // Available (Default)

//               if (isPast) {
//                 colorClass =
//                   "bg-gray-200 text-gray-500 cursor-not-allowed border-none ring-0";
//               } else if (data?.isLeave) {
//                 colorClass =
//                   "bg-red-200 text-red-600 hover:bg-red-100 ring-1 ring-red-100"; // Unavailable
//               } else if (data) {
//                 // Means custom slots exist
//                 colorClass =
//                   "bg-blue-200 text-blue-700 hover:bg-blue-100 ring-1 ring-blue-100"; // Limited Hours
//               }

//               // Selected State
//               if (selectedDateStr === iso) {
//                 colorClass =
//                   "bg-gray-800 text-white shadow-lg ring-2 ring-gray-800 transform scale-105";
//               }

//               return (
//                 <button
//                   key={day}
//                   onClick={() => handleClick(day)}
//                   disabled={isPast}
//                   className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all ${colorClass}`}
//                 >
//                   {day}
//                 </button>
//               );
//             })}
//         </div>

//         {/* Legend - IMPROVED WORDS */}
//         <div className="mt-8 flex flex-wrap justify-center gap-6 border-t pt-4">
//           <div className="flex items-center gap-2">
//             <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></span>
//             <span className="text-xs font-medium text-gray-600">Available</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="h-3 w-3 rounded-full bg-blue-500 shadow-sm shadow-blue-200"></span>
//             <span className="text-xs font-medium text-gray-600">
//               Limited Hours
//             </span>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="h-3 w-3 rounded-full bg-red-500 shadow-sm shadow-red-200"></span>
//             <span className="text-xs font-medium text-gray-600">
//               Unavailable
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

/* Types */
interface Availability {
  _id?: string;
  date: string;
  isLeave: boolean;
  timeRanges: { startTime: string; endTime: string }[];
}

interface Props {
  availability: Availability[];
  onDateClick: (a: Availability) => void;
  selectedDateStr?: string;
}

export default function AvailabilityCalendar({
  availability,
  onDateClick,
  selectedDateStr,
}: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 🔥 NEW LOGIC: Max Allowed Date (Today + 7 Days)
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 7);

  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  /* --- Navigation --- */
  const nextMonth = () => {
    setCurrentMonthDate(
      new Date(
        currentMonthDate.getFullYear(),
        currentMonthDate.getMonth() + 1,
        1
      )
    );
  };

  const prevMonth = () => {
    const newDate = new Date(
      currentMonthDate.getFullYear(),
      currentMonthDate.getMonth() - 1,
      1
    );
    // Prevent going back past current month
    if (
      newDate.getMonth() < today.getMonth() &&
      newDate.getFullYear() === today.getFullYear()
    ) {
      return;
    }
    setCurrentMonthDate(newDate);
  };

  /* --- Data Map --- */
  const availabilityMap: Record<string, Availability> = {};
  availability.forEach((a) => {
    availabilityMap[a.date] = a;
  });

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  /* --- Click Logic --- */
  const handleClick = (day: number) => {
    const isoDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const dateObj = new Date(year, month, day);

    // Validation 1: Past Date
    if (dateObj < today) {
      toast.error("Cannot select past dates");
      return;
    }

    // 🔥 Validation 2: Future Limit (7 Days)
    if (dateObj > maxDate) {
      toast.error("You can only book up to 7 days in advance");
      return;
    }

    const finalData: Availability = availabilityMap[isoDate] || {
      date: isoDate,
      isLeave: false,
      timeRanges: [],
    };

    onDateClick(finalData);
  };

  return (
    <div className="mt-6 flex w-full justify-center">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">
            {currentMonthDate.toLocaleString("default", { month: "long" })}{" "}
            {year}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={prevMonth}
              className="rounded-full bg-gray-50 p-2 text-gray-600 transition hover:bg-gray-200"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextMonth}
              className="rounded-full bg-gray-50 p-2 text-gray-600 transition hover:bg-gray-200"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="mb-4 grid grid-cols-7 place-items-center text-xs font-semibold tracking-wide text-gray-400 uppercase">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 place-items-center gap-y-4">
          {/* Empty Slots */}
          {Array(startDay)
            .fill(null)
            .map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

          {/* Days */}
          {Array(daysInMonth)
            .fill(null)
            .map((_, i) => {
              const day = i + 1;
              const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(
                day
              ).padStart(2, "0")}`;
              const dateObj = new Date(year, month, day);

              const isPast = dateObj < today;
              // 🔥 Check if date is beyond limit
              const isTooFar = dateObj > maxDate;
              const isDisabled = isPast || isTooFar;

              const data = availabilityMap[iso];

              // Colors Logic
              let colorClass =
                "bg-emerald-200 text-emerald-700 hover:bg-emerald-100 ring-1 ring-emerald-100"; // Available

              if (isDisabled) {
                // 🔥 Grey out future dates too
                colorClass =
                  "bg-gray-100 text-gray-400 cursor-not-allowed border-none ring-0";
              } else if (data?.isLeave) {
                colorClass =
                  "bg-red-200 text-red-600 hover:bg-red-100 ring-1 ring-red-100"; // Leave
              } else if (data) {
                colorClass =
                  "bg-blue-200 text-blue-700 hover:bg-blue-100 ring-1 ring-blue-100"; // Partial
              }

              if (selectedDateStr === iso && !isDisabled) {
                colorClass =
                  "bg-gray-800 text-white shadow-lg ring-2 ring-gray-800 transform scale-105";
              }

              return (
                <button
                  key={day}
                  onClick={() => handleClick(day)}
                  disabled={isDisabled}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all ${colorClass}`}
                >
                  {day}
                </button>
              );
            })}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 border-t pt-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></span>
            <span className="text-xs font-medium text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-blue-500 shadow-sm shadow-blue-200"></span>
            <span className="text-xs font-medium text-gray-600">
              Limited Hours
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500 shadow-sm shadow-red-200"></span>
            <span className="text-xs font-medium text-gray-600">
              Unavailable
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
