import { ErrorHandler } from "@/middlewares/error-handler.js";
import { AppointmentModel } from "@/models/appointment.js";
import { AvailabilityModel } from "@/models/availability.js";
import { DoctorModel } from "@/models/doctor.js";
import { StudentModel } from "@/models/student.js";
import { type RequestWithStudent } from "@/types/request.js";
import { IAppointmentStatus } from "@/types/types.js";
import { tryCatch } from "@/utils/try-catch.js";
import { validateId } from "@/utils/validate-id.js";
import type { Response } from "express";

const bookAppointment = tryCatch(async (req: RequestWithStudent, res: Response) => {
  const { doctorId, appointmentStartTime, appointmentEndTime, reason } = req.body;
  const { studentId } = req;

  if (!doctorId || !appointmentStartTime || !appointmentEndTime)
    throw new ErrorHandler(400, "All fields are required !");

  const doctor = await DoctorModel.findById(doctorId);
  if (!doctor) throw new ErrorHandler(404, "Doctor not found !");

  const student = await StudentModel.findById(studentId);
  if (!student) throw new ErrorHandler(404, "Student not found !");

  const start = new Date(appointmentStartTime);
  const end = new Date(appointmentEndTime);
  if (isNaN(start.getTime()) || isNaN(end.getTime()))
    throw new ErrorHandler(400, "Invalid date format !");
  if (start >= end) throw new ErrorHandler(400, "Start time must be before end time !");

  // check doctor availability
  const available = await AvailabilityModel.findOne({
    doctorId,
    startTime: { $lte: start },
    endTime: { $gte: end },
  });
  if (!available) throw new ErrorHandler(400, "Doctor is not available at the selected time !");

  // check overlapping appointments
  const overlapping = await AppointmentModel.findOne({
    doctorId,
    appointmentDate: { $lt: end },
    endTime: { $gt: start },
    status: { $ne: IAppointmentStatus.CANCELLED },
  });
  if (overlapping) throw new ErrorHandler(400, "Selected time slot already booked !");

  const appointment = await AppointmentModel.create({
    studentId,
    doctorId,
    appointmentDate: start,
    endTime: end,
    reason,
    status: IAppointmentStatus.PENDING,
  });

  await doctor.updateOne({ $push: { appointments: appointment._id } });
  await student.updateOne({ $push: { appointments: appointment._id } });

  return res.status(201).json({
    message: "Appointment booked successfully !",
    appointment,
  });
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

export { bookAppointment, cancelAppointment, updateAppointmentStatus };
