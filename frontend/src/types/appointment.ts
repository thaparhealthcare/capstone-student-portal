export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export interface DoctorForAppointment {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization?: string;
}

export interface Appointment {
  _id: string;
  doctorId: DoctorForAppointment | null;
  appointmentDate: string;
  endTime?: string;
  reason?: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}
