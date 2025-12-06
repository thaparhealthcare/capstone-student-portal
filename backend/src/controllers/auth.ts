import { cookieOptions } from "@/constants/cookie-options.js";
import { ErrorHandler } from "@/middlewares/error-handler.js";
import { StudentModel } from "@/models/student.js";
import { type RequestWithStudent } from "@/types/request.js";
import { type IStudent } from "@/types/types.js";
import { getDefaultPassword } from "@/utils/default-password.js";
import { generateToken } from "@/utils/generate-token.js";
import { tryCatch } from "@/utils/try-catch.js";
import bcrypt from "bcrypt";
import { type Request, type Response } from "express";

const checkToken = (req: Request, res: Response) => {
  const token = req.cookies?.token;

  if (!token) return res.status(401).json({ isLoggedIn: false });
  if (token) return res.status(200).json({ isLoggedIn: true });
};

const login = tryCatch(async (req: Request, res: Response) => {
  const rollNumber: string = req.body.rollNumber;
  const password: string = req.body.password;

  if (!rollNumber || !password) throw new ErrorHandler(400, "All fields are required !");

  const student: IStudent = await StudentModel.findOne({ rollNumber }).select("+password");
  if (!student) throw new ErrorHandler(401, "Invalid credentials !");

  let matchPassword = false;
  if (student.isPasswordDefault) matchPassword = password === getDefaultPassword(student);
  else matchPassword = await bcrypt.compare(password, student.password);

  if (!matchPassword) throw new ErrorHandler(401, "Invalid credentials !");

  generateToken(res, student.id);
  return res.status(200).json({ message: `Welcome ${student.name} !` });
});

const logout = (_req: Request, res: Response) => {
  res
    .status(200)
    .cookie("token", "", { ...cookieOptions, expires: new Date(Date.now()) })
    .json({ message: "Logged out successfully !" });
};

const getLoggedInStudent = tryCatch(async (req: RequestWithStudent, res: Response) => {
  const { studentId } = req;
  if (!studentId) throw new ErrorHandler(401, "Unauthorized, login required !");

  const student: IStudent | null = await StudentModel.findById(studentId);
  if (!student) throw new ErrorHandler(404, "Student not found !");

  return res.status(200).json(student);
});

export { checkToken, getLoggedInStudent, login, logout };
