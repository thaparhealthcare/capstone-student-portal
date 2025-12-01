import type { Doctor } from "../../types/booking";
import { getAvatarURL } from "../../utils/avatar"; // 👈 use same avatar util

interface Props {
  doctors: Doctor[];
  selectedDoctorId: string | null;
  onSelectDoctor: (id: string) => void;
}

export default function DoctorRow({
  doctors,
  selectedDoctorId,
  onSelectDoctor,
}: Props) {
  return (
    <div className="mb-4 rounded-xl bg-white p-4 shadow-md">
      <h2 className="mb-3 text-lg font-semibold text-gray-700">Doctors</h2>

      {doctors.length === 0 ? (
        <p className="text-sm text-gray-500">No doctors available.</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {doctors.map((doctor) => {
            const isActive = selectedDoctorId === doctor._id;

            return (
              <button
                key={doctor._id}
                onClick={() => onSelectDoctor(doctor._id)}
                className={`flex max-w-[190px] min-w-[190px] flex-col items-center rounded-xl border p-3 text-center transition hover:shadow-md ${
                  isActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                {/* Avatar from DiceBear */}
                <img
                  src={getAvatarURL(doctor.name, doctor.gender)}
                  alt={doctor.name}
                  className="mb-2 h-16 w-16 rounded-full object-cover"
                />

                <p className="text-sm font-semibold text-gray-800">
                  {doctor.name}
                </p>
                <p className="text-[11px] text-gray-500">
                  {doctor.designation || "Medical Officer"}
                </p>
                <p className="mt-1 text-[11px] text-gray-400">
                  {doctor.specialization || "General"}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
