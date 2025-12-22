import { getAvatarURL } from "@/utils/avatar";

interface Props {
  doctors: any[];
  selectedDoctorId: string | null;
  onSelectDoctor: (id: string) => void;
}

export default function DoctorSelector({
  doctors,
  selectedDoctorId,
  onSelectDoctor,
}: Props) {
  return (
    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {doctors.map((doc) => {
        const active = selectedDoctorId === doc._id;

        return (
          <button
            key={doc._id}
            onClick={() => onSelectDoctor(doc._id)}
            className={`group rounded-xl border p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
              active
                ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200"
                : "border-gray-200 bg-white"
            }`}
          >
            {/* Avatar */}
            <div className="mx-auto mb-3 h-16 w-16 overflow-hidden rounded-full border">
              <img
                src={getAvatarURL(doc.name, doc.gender)}
                alt={doc.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Name */}
            <p
              className={`text-sm font-semibold ${
                active ? "text-blue-700" : "text-gray-800"
              }`}
            >
              {doc.name}
            </p>

            {/* Role / Tag */}
            <p className="mt-1 text-xs text-gray-500">Doctor</p>

            {/* Selected Badge */}
            {active && (
              <div className="mt-2 text-xs font-medium text-blue-600">
                Selected
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
