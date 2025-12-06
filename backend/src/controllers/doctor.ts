import { ErrorHandler } from "@/middlewares/error-handler.js";
import { AppointmentModel } from "@/models/appointment.js";
import { DoctorModel } from "@/models/doctor.js";
import { tryCatch } from "@/utils/try-catch.js";
import { validateId } from "@/utils/validate-id.js";
import type { Request, Response } from "express";

const getAllDoctors = tryCatch(async (_req: Request, res: Response) => {
  const doctors = await DoctorModel.find({});
  return res.status(200).json(doctors);
});

const getDoctorAppointments = tryCatch(async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  if (!doctorId || !validateId(doctorId)) throw new ErrorHandler(400, "Invalid doctor ID !");

  const appointments = await AppointmentModel.find({ doctorId })
    .populate("studentId", "name rollNumber email phone")
    .sort({ appointmentDate: -1 });

  return res.status(200).json(appointments);
});

export { getAllDoctors, getDoctorAppointments };
