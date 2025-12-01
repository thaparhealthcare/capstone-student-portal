import DashboardLayout from "./DashboardLayout";

export default function HealthInfo() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        {/* OPD Timings */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
          <h1 className="mb-1 text-2xl font-bold text-gray-800">OPD Timings</h1>
          <p className="mb-4 text-xs text-gray-500">
            Thapar Institute of Engineering & Technology Health Centre
          </p>

          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <p className="font-semibold text-gray-800">Monday to Friday</p>
              <p className="text-gray-600">8:30 am to 6:00 pm</p>
            </div>

            <div>
              <p className="font-semibold text-gray-800">Saturday</p>
              <ul className="list-inside list-disc text-sm text-gray-600">
                <li>10:00 am to 2:00 pm</li>
                <li>3:00 pm to 7:00 pm</li>
                <li>8:00 pm to 2:00 am</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-gray-800">Sunday</p>
              <ul className="list-inside list-disc text-sm text-gray-600">
                <li>10:00 am to 2:00 pm</li>
                <li>10:00 pm to 6:00 am (Only Medical Assistant available)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Emergency & Ambulance */}
        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="mb-2 text-xl font-semibold text-blue-900">
            Emergency Services
          </h2>
          <p className="text-sm text-blue-900">
            • Emergency cases are attended by the doctor at the Health Centre.
          </p>
          <p className="mt-1 text-sm text-blue-900">
            • Ambulance services are available <b>24x7</b> for emergencies and
            hospital transfers.
          </p>
          <p className="mt-3 text-sm text-blue-900">
            <span className="font-semibold">Ambulance Contact:</span> +91
            8288008122
          </p>
        </section>

        {/* Goals & Focus Areas */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            Goals of the Health Centre
          </h2>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
            <li>
              Enhance overall productivity by supporting the health of students,
              teaching staff, and non-teaching staff.
            </li>
            <li>
              Raise health awareness on current and relevant health issues.
            </li>
          </ul>

          <h3 className="mt-4 text-sm font-semibold text-gray-800">
            Main Focus Areas
          </h3>
          <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-700">
            <li>
              Medical first aid and basic health care services for minor
              illnesses and injuries.
            </li>
            <li>
              Prompt and early referral to specialized care for serious health
              concerns.
            </li>
            <li>
              Immediate transfer of emergency cases using institute ambulance
              services.
            </li>
            <li>
              Health awareness programs and campaigns for the TIET community.
            </li>
          </ul>

          <p className="mt-3 text-xs text-gray-500">
            The Health Centre aims to ensure that students and staff have easy
            access to essential healthcare and clear guidance for maintaining
            good health.
          </p>
        </section>
      </div>
    </DashboardLayout>
  );
}
