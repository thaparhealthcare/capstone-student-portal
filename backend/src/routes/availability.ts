import {
  deleteAvailability,
  getDoctorAvailability,
  setAvailability,
} from "@/controllers/availability.js";
import { isLoggedIn } from "@/middlewares/auth.js";
import express from "express";

const router = express.Router();

router.post("/set-availability", isLoggedIn, setAvailability);
router.get("/get-availability/:doctorId", isLoggedIn, getDoctorAvailability);
router.delete("/delete-availability/:availabilityId", isLoggedIn, deleteAvailability);

export { router as availabilityRouter };
