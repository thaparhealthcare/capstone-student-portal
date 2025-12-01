import {
  bookAppointment,
  cancelAppointment,
  updateAppointmentStatus,
} from "@/controllers/appointment.js";
import { isLoggedIn } from "@/middlewares/auth.js";
import express from "express";

const router = express.Router();

router.post("/book-appointment", isLoggedIn, bookAppointment);
router.patch("/update-appointment-status/:appointmentId", isLoggedIn, updateAppointmentStatus);
router.delete("/cancel-appointment/:appointmentId", isLoggedIn, cancelAppointment);

export { router as appointmentRouter };
