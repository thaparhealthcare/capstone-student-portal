import { ErrorHandler } from "@/middlewares/error-handler.js";
import { AppointmentModel } from "@/models/appointment.js";
import { StudentModel } from "@/models/student.js";
import { type RequestWithStudent } from "@/types/request.js";
import { IStudent } from "@/types/types.js";
import { getDefaultPassword } from "@/utils/default-password.js";
import { tryCatch } from "@/utils/try-catch.js";
import bcrypt from "bcrypt";
import { type Response } from "express";

const updatePassword = tryCatch(async (req: RequestWithStudent, res: Response) => {
  const oldPassword: string = req.body.oldPassword;
  if (!oldPassword) throw new ErrorHandler(400, "Current password is required !");
  const newPassword: string = req.body.newPassword;
  if (!newPassword) throw new ErrorHandler(400, "New password cannot be empty !");
  if (oldPassword === newPassword)
    throw new ErrorHandler(400, "Current and New password cannot be same !");

  const { studentId } = req;
  if (!studentId) throw new ErrorHandler(401, "Unauthorized !");
  const student: IStudent = await StudentModel.findById(studentId).select("+password");
  if (!student) throw new ErrorHandler(404, "Student not found !");

  let matchOldPassword = false;
  if (student.isPasswordDefault) matchOldPassword = oldPassword === getDefaultPassword(student);
  else matchOldPassword = await bcrypt.compare(oldPassword, student.password);

  if (!matchOldPassword) throw new ErrorHandler(401, "Current password is incorrect !");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await StudentModel.findByIdAndUpdate(studentId, {
    password: hashedPassword,
    isPasswordDefault: false,
  });

  return res.status(200).json({ message: "Password updated successfully !" });
});

const getStudentAppointments = tryCatch(async (req: RequestWithStudent, res: Response) => {
  const { studentId } = req;
  if (!studentId) throw new ErrorHandler(401, "Unauthorized, login required !");

  const appointments = await AppointmentModel.find({ studentId })
    .populate("doctorId", "name email phone specialization")
    .sort({ appointmentDate: -1 });

  return res.status(200).json(appointments);
});

export { getStudentAppointments, updatePassword };
