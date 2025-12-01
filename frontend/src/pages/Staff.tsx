import DashboardLayout from "./DashboardLayout";

interface StaffMember {
  name: string;
  role: string;
  qualification: string;
  experience: string;
}

const head = {
  name: "Dr. Vishal Srivastava",
  role: "Head Health Centre • Faculty-in-Charge",
  qualification: "Professor, EIED",
  email: "healthcentre@thapar.edu",
};

const doctors: StaffMember[] = [
  {
    name: "Dr. Ritu Bassi",
    role: "Sr. Medical Officer",
    qualification: "M.B.B.S, PGDHA",
    experience: "23 years experience",
  },
  {
    name: "Dr. Ajay Gupta",
    role: "Medical Officer (Pediatrics)",
    qualification: "M.B.B.S, M.D (Pediatrics)",
    experience: "46 years experience",
  },
  {
    name: "Dr. Jeevan Jot Singh",
    role: "Medical Officer",
    qualification: "M.B.B.S",
    experience: "9.2 years experience",
  },
  {
    name: "Dr. Sarabjeet Kaur",
    role: "Medical Officer",
    qualification: "B.H.M.S",
    experience: "15 years experience",
  },
];

const pharmacists: StaffMember[] = [
  {
    name: "Mr. Abhishek Bhardwaj",
    role: "Associate (Pharmacist)",
    qualification:
      "D-Pharma, B-Pharma, MBA (H.M.), Diploma in Computer Application",
    experience: "12 years experience",
  },
  {
    name: "Mr. Anish",
    role: "Junior Associate (Pharmacist)",
    qualification: "D-Pharma, BSc (Medical)",
    experience: "12 years experience",
  },
  {
    name: "Mr. Kamalpreet Singh",
    role: "Pharmacist",
    qualification: "D-Pharma, B-Pharma",
    experience: "12 years experience",
  },
];

const medicalAssistants: StaffMember[] = [
  {
    name: "Mr. Avtar Singh",
    role: "Medical Assistant",
    qualification: "B.A, Nursing Diploma (Army Medical Corps)",
    experience: "31 years experience",
  },
];

const nursingStaff: StaffMember[] = [
  {
    name: "Mrs. Satvir Kaur",
    role: "Senior Associate (Staff Nurse)",
    qualification: "Diploma in General Nursing",
    experience: "23 years experience",
  },
  {
    name: "Mrs. Jasmine",
    role: "Staff Nurse",
    qualification: "DMLT, GNM",
    experience: "14 years experience",
  },
];

const helpingStaff: StaffMember[] = [
  {
    name: "Mr. Partap Ram",
    role: "Peon",
    qualification: "",
    experience: "31 years experience",
  },
  {
    name: "Ms. Neha",
    role: "Helper",
    qualification: "Bachelor of Arts",
    experience: "2 years experience",
  },
];

type Accent = "blue" | "emerald" | "indigo" | "amber" | "slate";

const accentStyles: Record<
  Accent,
  { border: string; pill: string; role: string }
> = {
  blue: {
    border: "from-blue-500/70 to-cyan-400/70",
    pill: "bg-blue-50 text-blue-700",
    role: "text-blue-700",
  },
  emerald: {
    border: "from-emerald-500/70 to-teal-400/70",
    pill: "bg-emerald-50 text-emerald-700",
    role: "text-emerald-700",
  },
  indigo: {
    border: "from-indigo-500/70 to-sky-400/70",
    pill: "bg-indigo-50 text-indigo-700",
    role: "text-indigo-700",
  },
  amber: {
    border: "from-amber-500/70 to-orange-400/70",
    pill: "bg-amber-50 text-amber-700",
    role: "text-amber-700",
  },
  slate: {
    border: "from-slate-400/70 to-slate-300/70",
    pill: "bg-slate-50 text-slate-700",
    role: "text-slate-700",
  },
};

function StaffSection({
  title,
  members,
  accent,
}: {
  title: string;
  members: StaffMember[];
  accent: Accent;
}) {
  const colors = accentStyles[accent];

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-slate-900 uppercase">
          {title}
        </h2>
        <div className="ml-4 h-px flex-1 bg-slate-200" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {members.map((m) => (
          <article
            key={m.name}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            {/* top gradient strip */}
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${colors.border}`}
            />

            <div className="mt-2 space-y-1.5">
              <h3 className="text-sm font-semibold text-slate-900">{m.name}</h3>
              <p
                className={`text-[11px] font-semibold tracking-wide uppercase ${colors.role}`}
              >
                {m.role}
              </p>
              {m.qualification && (
                <p className="pt-1 text-xs leading-relaxed text-slate-600">
                  {m.qualification}
                </p>
              )}
            </div>

            <p
              className={`mt-3 inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${colors.pill}`}
            >
              {m.experience}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Staff() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl px-2 lg:px-0">
        {/* Header / summary card */}
        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
            Student Portal · TIET Health Centre
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-xl">
              <h1 className="text-xl font-semibold text-slate-900">
                Health Centre Team
              </h1>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                A dedicated team of doctors, pharmacists, nursing and support
                staff providing medical care and guidance to the TIET community.
              </p>
            </div>

            <div className="max-w-xs rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700">
              <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                Head Health Centre
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {head.name}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-600">{head.role}</p>
              <p className="mt-0.5 text-[11px] text-slate-600">
                {head.qualification}
              </p>
              <p className="mt-1 text-[11px] text-slate-600">
                Contact:{" "}
                <a
                  href={`mailto:${head.email}`}
                  className="underline underline-offset-2"
                >
                  {head.email}
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Sections with subtle color accents */}
        <StaffSection title="Doctors" members={doctors} accent="blue" />
        <StaffSection
          title="Pharmacists"
          members={pharmacists}
          accent="emerald"
        />
        <StaffSection
          title="Medical Assistants"
          members={medicalAssistants}
          accent="indigo"
        />
        <StaffSection
          title="Nursing Staff"
          members={nursingStaff}
          accent="amber"
        />
        <StaffSection
          title="Helping Staff"
          members={helpingStaff}
          accent="slate"
        />
      </div>
    </DashboardLayout>
  );
}
