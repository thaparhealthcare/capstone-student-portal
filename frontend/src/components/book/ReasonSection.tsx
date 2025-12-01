interface Props {
  reason: string;
  onChange: (value: string) => void;
  disabled: boolean;
  onBook: () => void;
  loading: boolean;
}

export default function ReasonSection({
  reason,
  onChange,
  disabled,
  onBook,
  loading,
}: Props) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-md">
      <h3 className="mb-2 text-sm font-semibold text-gray-700">
        Reason for Appointment
      </h3>

      <textarea
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
        placeholder="e.g. Headache since 3 days, general checkup before exams..."
        value={reason}
        onChange={(e) => onChange(e.target.value)}
      />

      <button
        onClick={onBook}
        disabled={disabled}
        className="mt-3 w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {loading ? "Booking..." : "Book Appointment"}
      </button>
    </div>
  );
}
