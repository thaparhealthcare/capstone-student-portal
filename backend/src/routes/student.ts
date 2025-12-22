import { getStudentAppointments, updatePassword } from "@/controllers/student.js";
import {
  getPastStudentAppointments,
  getStudentAppointmentsForSB,
  getUpcomingStudentAppointments,
} from "@/controllers/studentAppointment";
import { isLoggedIn } from "@/middlewares/auth.js";
import express from "express";

const router = express.Router();

router.post("/update-password", isLoggedIn, updatePassword);
router.get("/get-appointments/:studentId", isLoggedIn, getStudentAppointments);
router.get("/appointments", isLoggedIn, getStudentAppointmentsForSB);
router.get("/appointments/upcoming", isLoggedIn, getUpcomingStudentAppointments);
router.get("/appointments/past", isLoggedIn, getPastStudentAppointments);

export { router as studentRouter };
