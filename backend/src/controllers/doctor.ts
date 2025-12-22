import { ErrorHandler } from "@/middlewares/error-handler";
import { tryCatch } from "@/utils/try-catch.js";
import { validateId } from "@/utils/validate-id";
import axios from "axios";
import type { Request, Response } from "express";

export const getAllDoctors = tryCatch(async (_req: Request, res: Response) => {
  const response = await axios.get(`${process.env.DOCTOR_API_URL}/doctor/findalldoctors`);

  return res.status(200).json(response.data.doctors);
});

// const getDoctorAppointments = tryCatch(async (req: Request, res: Response) => {
//   const { doctorId } = req.params;
//   if (!doctorId || !validateId(doctorId)) throw new ErrorHandler(400, "Invalid doctor ID !");

//   const appointments = await AppointmentModel.find({ doctorId })
//     .populate("studentId", "name rollNumber email phone")
//     .sort({ appointmentDate: -1 });

//   return res.status(200).json(appointments);
// });
export const getDoctorAvailability = tryCatch(async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  if (!doctorId || !validateId(doctorId)) {
    throw new ErrorHandler(400, "Invalid doctor ID");
  }

  const response = await axios.get(
    `${process.env.DOCTOR_API_URL}/doctor/public/${doctorId}/availability`
  );

  return res.status(200).json(response.data.availability);
});
