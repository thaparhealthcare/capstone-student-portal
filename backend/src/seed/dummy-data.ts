import { AvailabilityModel } from "@/models/availability.js";
import { DoctorModel } from "@/models/doctor.js";
import { StudentModel } from "@/models/student.js";
import { IBloodGroup, IGender } from "@/types/types.js";

const addDummyStudent = async () => {
  const existing = await StudentModel.findOne({ rollNumber: "102203331" });
  if (existing) {
    console.log("Dummy student already exists:", existing.rollNumber);
    return;
  }

  const student = await StudentModel.create({
    rollNumber: "102203331",
    name: "Raghav Bhagat",
    email: "rbhagat_be22@thapar.edu",
    password: "RaghavBhagat@06042004",
    phone: "7087394178",
    gender: IGender.MALE,
    dob: new Date("2004-04-06"),
    department: "COE",
    hostel: "M",
    roomNumber: "C-204",
    yearOfStudy: 4,
    emergencyContact: "7087394178",
    bloodGroup: IBloodGroup.O_POS,
  });

  console.log("Dummy student added:", student.rollNumber);
};

const addDummyDoctors = async () => {
  const doctorsData = [
    {
      name: "Dr. Ritu Bassi",
      email: "ritu.bassi@thapar.edu",
      phone: "9000000001",
      gender: IGender.FEMALE,
      specialization: "M.B.B.S, PGDHA (General Medicine)",
      designation: "SR. MEDICAL OFFICER",
    },
    {
      name: "Dr. Ajay Gupta",
      email: "ajay.gupta@thapar.edu",
      phone: "9000000002",
      gender: IGender.MALE,
      specialization: "M.B.B.S, M.D (Pediatrics)",
      designation: "MEDICAL OFFICER",
    },
    {
      name: "Dr. Jeevan Jot Singh",
      email: "jeevan.jot.singh@thapar.edu",
      phone: "9000000003",
      gender: IGender.MALE,
      specialization: "M.B.B.S (General Medicine)",
      designation: "MEDICAL OFFICER",
    },
    {
      name: "Dr. Sarabjeet Kaur",
      email: "sarabjeet.kaur@thapar.edu",
      phone: "9000000004",
      gender: IGender.FEMALE,
      specialization: "B.H.M.S",
      designation: "MEDICAL OFFICER",
    },
  ];

  for (const doc of doctorsData) {
    const exists = await DoctorModel.findOne({ email: doc.email });
    if (exists) {
      console.log("Doctor already exists:", exists.name);
      continue;
    }

    const created = await DoctorModel.create(doc);
    console.log("Doctor added:", created.name);
  }
};

const addYearAvailabilityForAllDoctors = async () => {
  const doctors = await DoctorModel.find({});
  if (!doctors.length) {
    console.log("No doctors found to create availability.");
    return;
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const DAYS = 365;
  const START_HOUR = 9; // 09:00
  const END_HOUR = 12; // 12:00

  const availabilitiesToInsert: {
    doctorId: string;
    startTime: Date;
    endTime: Date;
  }[] = [];

  for (let i = 0; i < DAYS; i++) {
    const day = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);

    for (const doctor of doctors) {
      const startTime = new Date(day);
      startTime.setUTCHours(START_HOUR, 0, 0, 0);

      const endTime = new Date(day);
      endTime.setUTCHours(END_HOUR, 0, 0, 0);

      availabilitiesToInsert.push({
        doctorId: doctor._id.toString(),
        startTime,
        endTime,
      });
    }
  }

  const created = await AvailabilityModel.insertMany(availabilitiesToInsert);
  console.log(`Created ${created.length} availability slots for 1 year.`);
};

export { addDummyDoctors, addDummyStudent, addYearAvailabilityForAllDoctors };
