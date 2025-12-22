import { ErrorHandler } from "@/middlewares/error-handler.js";
import { AppointmentModel } from "@/models/appointment.js";
import { StudentModel } from "@/models/student";
import { type RequestWithStudent } from "@/types/request.js";
import { IAppointmentStatus } from "@/types/types.js";
import { tryCatch } from "@/utils/try-catch.js";
import { validateId } from "@/utils/validate-id.js";
import axios from "axios";
import type { Response } from "express";

import { RequestHandler } from "express";

export const bookAppointment: RequestHandler = tryCatch(async (req: RequestWithStudent, res) => {
  const { doctorId, date, startTime, endTime, reason } = req.body;

  const studentId = req.studentId;

  if (!studentId) {
    throw new ErrorHandler(401, "Unauthorized");
  }

  if (!doctorId || !date || !startTime || !endTime || !reason) {
    throw new ErrorHandler(400, "All fields are required");
  }
  const student = await StudentModel.findById(studentId);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  // 👉 Doctor backend call
  const response = await axios.post(`${process.env.DOCTOR_API_URL}/doctor/appointment/book`, {
    doctorId,
    student: {
      id: student._id,
      name: student.name,
      rollNumber: student.rollNumber,
      department: student.department,
      year: student.year,
      email: student.email,
      phone: student.phone,
    },
    date,
    startTime,
    endTime,
    reason,
  });

  return res.status(201).json(response.data);
});

const updateAppointmentStatus = tryCatch(async (req: RequestWithStudent, res: Response) => {
  const { appointmentId } = req.params;
  const { status, notes } = req.body;

  if (!appointmentId || !validateId(appointmentId))
    throw new ErrorHandler(400, "Invalid appointment ID !");
  if (!status) throw new ErrorHandler(400, "Status is required !");

  const validStatuses = [
    IAppointmentStatus.PENDING,
    IAppointmentStatus.CONFIRMED,
    IAppointmentStatus.COMPLETED,
    IAppointmentStatus.CANCELLED,
  ];

  if (!validStatuses.includes(status)) throw new ErrorHandler(400, "Invalid status value !");

  const appointment = await AppointmentModel.findById(appointmentId);
  if (!appointment) throw new ErrorHandler(404, "Appointment not found !");

  appointment.status = status;
  if (notes) appointment.notes = notes;
  await appointment.save();

  return res.status(200).json({
    message: "Appointment status updated successfully !",
    appointment,
  });
});

const cancelAppointment = tryCatch(async (req: RequestWithStudent, res: Response) => {
  const { appointmentId } = req.params;
  const { studentId } = req;

  if (!studentId) throw new ErrorHandler(401, "Unauthorized, login required !");
  if (!appointmentId || !validateId(appointmentId))
    throw new ErrorHandler(400, "Invalid appointment ID !");

  const appointment = await AppointmentModel.findById(appointmentId);
  if (!appointment) throw new ErrorHandler(404, "Appointment not found !");

  if (appointment.studentId.toString() !== studentId)
    throw new ErrorHandler(403, "You can only cancel your own appointments !");

  if (appointment.status === IAppointmentStatus.CANCELLED)
    throw new ErrorHandler(400, "Appointment already cancelled !");

  appointment.status = IAppointmentStatus.CANCELLED;
  await appointment.save();

  return res.status(200).json({ message: "Appointment cancelled successfully !" });
});

export { cancelAppointment, updateAppointmentStatus };
