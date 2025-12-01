// import { doctorApi } from "@/api/doctorApi";
// import { CalendarDays, Clock, Mail, Phone, Stethoscope } from "lucide-react";
// import { useEffect, useMemo, useState } from "react";
// import { HashLoader } from "react-spinners";
// import { toast } from "sonner";
// import { appointmentApi } from "../api/appointmentApi";
// import { availabilityApi } from "../api/availabilityApi";
// import { getAvatarURL } from "../utils/avatar";
// import DashboardLayout from "./DashboardLayout";

// interface Doctor {
//   _id: string;
//   name: string;
//   email: string;
//   phone: string;
//   specialization?: string;
//   designation?: string;
//   gender?: string;
// }

// interface Availability {
//   _id: string;
//   doctorId: string;
//   startTime: string;
//   endTime: string;
// }

// interface TimeSlot {
//   start: Date;
//   end: Date;
// }

// export default function BookAppointment() {
//   const [doctors, setDoctors] = useState<Doctor[]>([]);
//   const [loadingDoctors, setLoadingDoctors] = useState(true);

//   const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
//   const [availability, setAvailability] = useState<Availability[]>([]);
//   const [loadingAvailability, setLoadingAvailability] = useState(false);

//   const [selectedDate, setSelectedDate] = useState<string | null>(null);
//   const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

//   const [reason, setReason] = useState("");
//   const [booking, setBooking] = useState(false);

//   // Fetch all doctors on mount
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const res = await doctorApi.getAllDoctors();
//         setDoctors(res.data || []);
//       } catch (err: any) {
//         toast.error(
//           err?.response?.data?.message || "Failed to load doctors list"
//         );
//       } finally {
//         setLoadingDoctors(false);
//       }
//     };

//     fetchDoctors();
//   }, []);

//   // Fetch availability when doctor changes
//   const handleSelectDoctor = async (doctorId: string) => {
//     setSelectedDoctorId(doctorId);
//     setAvailability([]);
//     setSelectedDate(null);
//     setSelectedSlot(null);

//     try {
//       setLoadingAvailability(true);
//       const res = await availabilityApi.getDoctorAvailability(doctorId);
//       const data: Availability[] = res.data || [];
//       setAvailability(data);

//       if (data.length > 0) {
//         const firstDate = new Date(data[0].startTime)
//           .toISOString()
//           .split("T")[0];
//         setSelectedDate(firstDate);
//       } else {
//         toast.info("No availability found for this doctor.");
//       }
//     } catch (err: any) {
//       toast.error(
//         err?.response?.data?.message || "Failed to load availability"
//       );
//     } finally {
//       setLoadingAvailability(false);
//     }
//   };

//   // Unique dates from availability
//   const availableDates = useMemo(() => {
//     const set = new Set<string>();
//     availability.forEach((slot) => {
//       const dateStr = new Date(slot.startTime).toISOString().split("T")[0];
//       set.add(dateStr);
//     });
//     return Array.from(set);
//   }, [availability]);

//   // Generate time slots for selected date from availability
//   const timeSlots: TimeSlot[] = useMemo(() => {
//     if (!selectedDate) return [];

//     const slots: TimeSlot[] = [];
//     const SLOT_MINUTES = 30;

//     availability.forEach((av) => {
//       const start = new Date(av.startTime);
//       const end = new Date(av.endTime);
//       const dateStr = start.toISOString().split("T")[0];

//       if (dateStr !== selectedDate) return;

//       let current = new Date(start);

//       while (current < end) {
//         const next = new Date(current.getTime() + SLOT_MINUTES * 60 * 1000);
//         if (next <= end) {
//           slots.push({ start: new Date(current), end: new Date(next) });
//         }
//         current = next;
//       }
//     });

//     return slots;
//   }, [availability, selectedDate]);

//   const formatTime = (date: Date) =>
//     date.toLocaleTimeString("en-IN", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//   const formatDate = (str: string) => {
//     const d = new Date(str);
//     return d.toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const selectedDoctor = useMemo(
//     () => doctors.find((d) => d._id === selectedDoctorId) || null,
//     [doctors, selectedDoctorId]
//   );

//   // Book appointment
//   const handleBookAppointment = async () => {
//     if (!selectedDoctorId || !selectedSlot) {
//       toast.error("Please select a doctor and time slot");
//       return;
//     }

//     if (!reason.trim()) {
//       toast.error("Please enter a reason for the appointment");
//       return;
//     }

//     try {
//       setBooking(true);
//       await appointmentApi.bookAppointment(
//         selectedDoctorId,
//         selectedSlot.start.toISOString(),
//         selectedSlot.end.toISOString(),
//         reason.trim()
//       );
//       toast.success("Appointment booked successfully!");
//       setSelectedSlot(null);
//       setReason("");
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || "Failed to book appointment");
//     } finally {
//       setBooking(false);
//     }
//   };

//   return (
//     <DashboardLayout>
//       <div className="mx-auto max-w-6xl">
//         <h1 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-800">
//           <Stethoscope className="text-blue-600" />
//           Book Appointment
//         </h1>

//         <p className="mb-6 text-sm text-gray-600">
//           Select a doctor, choose an available time slot, and book your
//           appointment.
//         </p>

//         <div className="grid gap-6 lg:grid-cols-3">
//           {/* Doctor List */}
//           <div className="max-h-[520px] overflow-y-auto rounded-xl bg-white p-4 shadow-md lg:col-span-1">
//             <h2 className="mb-3 text-lg font-semibold text-gray-700">
//               Doctors
//             </h2>

//             {loadingDoctors ? (
//               <div className="flex items-center justify-center py-10">
//                 <HashLoader size={40} color="#2563eb" />
//               </div>
//             ) : doctors.length === 0 ? (
//               <p className="text-sm text-gray-500">
//                 No doctors available at the moment.
//               </p>
//             ) : (
//               <div className="space-y-3">
//                 {doctors.map((doctor) => (
//                   <button
//                     key={doctor._id}
//                     onClick={() => handleSelectDoctor(doctor._id)}
//                     className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition hover:shadow-md ${
//                       selectedDoctorId === doctor._id
//                         ? "border-blue-500 bg-blue-50"
//                         : "border-gray-200 bg-white"
//                     }`}
//                   >
//                     <img
//                       src={getAvatarURL(doctor.name, doctor.gender)}
//                       alt={doctor.name}
//                       className="h-10 w-10 rounded-full"
//                     />

//                     <div>
//                       <p className="font-semibold text-gray-800">
//                         {doctor.name}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {doctor.designation || "Doctor"} •{" "}
//                         {doctor.specialization || "General"}
//                       </p>
//                       <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-400">
//                         <Mail size={12} /> {doctor.email}
//                       </p>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Availability + Slots + Form */}
//           <div className="space-y-4 lg:col-span-2">
//             {/* Selected Doctor Info */}
//             <div className="rounded-xl bg-white p-4 shadow-md">
//               {selectedDoctor ? (
//                 <div className="flex items-center gap-4">
//                   <img
//                     src={getAvatarURL(
//                       selectedDoctor.name,
//                       selectedDoctor.gender
//                     )}
//                     alt={selectedDoctor.name}
//                     className="h-12 w-12 rounded-full"
//                   />
//                   <div>
//                     <p className="font-semibold text-gray-800">
//                       {selectedDoctor.name}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {selectedDoctor.designation || "Doctor"} •{" "}
//                       {selectedDoctor.specialization || "General"}
//                     </p>
//                     <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
//                       <Phone size={12} /> {selectedDoctor.phone}
//                     </p>
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-sm text-gray-500">
//                   Please select a doctor from the left to see availability.
//                 </p>
//               )}
//             </div>

//             {/* Availability Dates */}
//             <div className="rounded-xl bg-white p-4 shadow-md">
//               <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
//                 <CalendarDays className="text-blue-600" size={18} />
//                 Available Dates
//               </h3>

//               {loadingAvailability ? (
//                 <div className="flex items-center justify-center py-6">
//                   <HashLoader size={35} color="#2563eb" />
//                 </div>
//               ) : !selectedDoctorId ? (
//                 <p className="text-xs text-gray-500">
//                   Select a doctor first to view availability.
//                 </p>
//               ) : availableDates.length === 0 ? (
//                 <p className="text-xs text-red-500">
//                   No availability added for this doctor.
//                 </p>
//               ) : (
//                 <div className="flex flex-wrap gap-2">
//                   {availableDates.map((dateStr) => (
//                     <button
//                       key={dateStr}
//                       onClick={() => {
//                         setSelectedDate(dateStr);
//                         setSelectedSlot(null);
//                       }}
//                       className={`rounded-full border px-3 py-1 text-xs transition ${
//                         selectedDate === dateStr
//                           ? "border-blue-600 bg-blue-600 text-white"
//                           : "border-gray-300 bg-white text-gray-700 hover:bg-blue-50"
//                       }`}
//                     >
//                       {formatDate(dateStr)}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Time Slots */}
//             <div className="rounded-xl bg-white p-4 shadow-md">
//               <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
//                 <Clock className="text-blue-600" size={18} />
//                 Available Time Slots
//               </h3>

//               {!selectedDoctorId ? (
//                 <p className="text-xs text-gray-500">
//                   Select a doctor and date to see slots.
//                 </p>
//               ) : !selectedDate ? (
//                 <p className="text-xs text-gray-500">
//                   Pick a date to view time slots.
//                 </p>
//               ) : timeSlots.length === 0 ? (
//                 <p className="text-xs text-red-500">
//                   No time slots available for this date.
//                 </p>
//               ) : (
//                 <div className="grid gap-2 sm:grid-cols-3">
//                   {timeSlots.map((slot, idx) => {
//                     const key = `${slot.start.toISOString()}-${idx}`;
//                     const isSelected =
//                       selectedSlot &&
//                       selectedSlot.start.getTime() === slot.start.getTime() &&
//                       selectedSlot.end.getTime() === slot.end.getTime();

//                     return (
//                       <button
//                         key={key}
//                         onClick={() => setSelectedSlot(slot)}
//                         className={`rounded-lg border px-3 py-2 text-xs transition ${
//                           isSelected
//                             ? "border-blue-600 bg-blue-600 text-white"
//                             : "border-gray-300 bg-white text-gray-700 hover:bg-blue-50"
//                         }`}
//                       >
//                         {formatTime(slot.start)} - {formatTime(slot.end)}
//                       </button>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* Reason + Book Button */}
//             <div className="rounded-xl bg-white p-4 shadow-md">
//               <h3 className="mb-2 text-sm font-semibold text-gray-700">
//                 Reason for Appointment
//               </h3>

//               <textarea
//                 className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
//                 rows={3}
//                 placeholder="e.g. Headache since 3 days, general checkup before exams..."
//                 value={reason}
//                 onChange={(e) => setReason(e.target.value)}
//               />

//               <button
//                 onClick={handleBookAppointment}
//                 disabled={
//                   booking ||
//                   !selectedDoctorId ||
//                   !selectedSlot ||
//                   !reason.trim()
//                 }
//                 className="mt-3 w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
//               >
//                 {booking ? "Booking..." : "Book Appointment"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }
import { Stethoscope } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { appointmentApi } from "../api/appointmentApi";
import { availabilityApi } from "../api/availabilityApi";
import { doctorApi } from "../api/doctorApi";
import AvailabilitySection from "../components/book/AvailabilitySection";
import DoctorRow from "../components/book/DoctorRow";
import ReasonSection from "../components/book/ReasonSection";
import type { Doctor, TimeSlot } from "../types/booking";
import DashboardLayout from "./DashboardLayout";

interface Availability {
  _id: string;
  doctorId: string;
  startTime: string;
  endTime: string;
}

export default function BookAppointment() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const [reason, setReason] = useState("");
  const [booking, setBooking] = useState(false);

  // for scroll after doctor selection
  const availabilityRef = useRef<HTMLDivElement | null>(null);

  // Fetch doctors once
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await doctorApi.getAllDoctors();
        setDoctors(res.data || []);
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message || "Failed to load doctors list"
        );
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  // When doctor is clicked
  const handleSelectDoctor = async (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setAvailability([]);
    setSelectedDate(null);
    setSelectedSlot(null);

    try {
      setLoadingAvailability(true);
      const res = await availabilityApi.getDoctorAvailability(doctorId);
      const data: Availability[] = res.data || [];
      setAvailability(data);

      if (data.length > 0) {
        const firstDate = new Date(data[0].startTime)
          .toISOString()
          .split("T")[0];
        setSelectedDate(firstDate);
      } else {
        toast.info("No availability found for this doctor.");
      }

      // scroll to availability section
      if (availabilityRef.current) {
        availabilityRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to load availability"
      );
    } finally {
      setLoadingAvailability(false);
    }
  };

  // Build unique dates from availability
  const availableDates = useMemo(() => {
    const set = new Set<string>();
    availability.forEach((slot) => {
      const dateStr = new Date(slot.startTime).toISOString().split("T")[0];
      set.add(dateStr);
    });
    return Array.from(set);
  }, [availability]);

  // Build time slots for selected date
  const timeSlots: TimeSlot[] = useMemo(() => {
    if (!selectedDate) return [];

    const slots: TimeSlot[] = [];
    const SLOT_MIN = 30;

    availability.forEach((av) => {
      const start = new Date(av.startTime);
      const end = new Date(av.endTime);
      const dateStr = start.toISOString().split("T")[0];

      if (dateStr !== selectedDate) return;

      let current = new Date(start);

      while (current < end) {
        const next = new Date(current.getTime() + SLOT_MIN * 60 * 1000);
        if (next <= end) {
          slots.push({ start: new Date(current), end: new Date(next) });
        }
        current = next;
      }
    });

    return slots;
  }, [availability, selectedDate]);

  const handleBookAppointment = async () => {
    if (!selectedDoctorId || !selectedSlot) {
      toast.error("Please select a doctor and time slot");
      return;
    }

    if (!reason.trim()) {
      toast.error("Please enter a reason");
      return;
    }

    try {
      setBooking(true);
      await appointmentApi.bookAppointment(
        selectedDoctorId,
        selectedSlot.start.toISOString(),
        selectedSlot.end.toISOString(),
        reason.trim()
      );
      toast.success("Appointment booked successfully!");
      setSelectedSlot(null);
      setReason("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to book appointment");
    } finally {
      setBooking(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-800">
          <Stethoscope className="text-blue-600" />
          Book Appointment
        </h1>

        <p className="mb-4 text-sm text-gray-600">
          First select a doctor from the top row, then choose a date and time
          slot, and finally confirm your appointment.
        </p>

        {/* Doctors row (with images & horizontal scroll) */}
        <DoctorRow
          doctors={doctors}
          selectedDoctorId={selectedDoctorId}
          onSelectDoctor={handleSelectDoctor}
        />

        {/* Availability + Reason */}
        <div ref={availabilityRef} className="mt-4 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AvailabilitySection
              availableDates={availableDates}
              selectedDate={selectedDate}
              onSelectDate={(d) => {
                setSelectedDate(d);
                setSelectedSlot(null);
              }}
              loadingAvailability={loadingAvailability}
              hasDoctor={!!selectedDoctorId}
              timeSlots={timeSlots}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
            />
          </div>

          <div className="lg:col-span-1">
            <ReasonSection
              reason={reason}
              onChange={setReason}
              disabled={
                booking || !selectedDoctorId || !selectedSlot || !reason.trim()
              }
              onBook={handleBookAppointment}
              loading={booking}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
