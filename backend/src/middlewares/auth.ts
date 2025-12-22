import { cookieOptions } from "@/constants/cookie-options.js";
import { StudentModel } from "@/models/student.js";
import { type RequestWithStudent } from "@/types/request.js";
import { type NextFunction, type Response } from "express";
import jwt from "jsonwebtoken";

interface JwtPayloadTypes {
  studentId: string;
  iat: number;
  exp: number;
}

const isLoggedIn = async (req: RequestWithStudent, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "Please login to continue !" });

    const loggedInStudent = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as JwtPayloadTypes;

    if (!loggedInStudent) {
      return res
        .status(401)
        .cookie("token", "", { ...cookieOptions, expires: new Date(Date.now()) })
        .json({ message: "Invalid token !" });
    }

    const student = await StudentModel.findById(loggedInStudent.studentId);

    if (!student) {
      return res
        .status(401)
        .cookie("token", "", { ...cookieOptions, expires: new Date(Date.now()) })
        .json({ message: "Student not found !" });
    }

    req.studentId = loggedInStudent.studentId;
    next();
  } catch {
    return res
      .status(401)
      .cookie("token", "", { ...cookieOptions, expires: new Date(Date.now()) })
      .json({ message: "Session expired. Please login again !" });
  }
};

export { isLoggedIn };
