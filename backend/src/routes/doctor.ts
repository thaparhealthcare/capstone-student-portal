import { getAllDoctors, getDoctorAvailability } from "@/controllers/doctor.js";
import { isLoggedIn } from "@/middlewares/auth.js";
import express from "express";

const router = express.Router();

router.get("/get-all-doctors", isLoggedIn, getAllDoctors);
// router.get("/get-appointments/:doctorId", isLoggedIn, getDoctorAppointments);
router.get("/:doctorId/availability", isLoggedIn, getDoctorAvailability);

export { router as doctorRouter };
