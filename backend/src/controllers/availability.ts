import { ErrorHandler } from "@/middlewares/error-handler.js";
import { AvailabilityModel } from "@/models/availability.js";
import { DoctorModel } from "@/models/doctor.js";
import { type RequestWithStudent } from "@/types/request.js";
import { tryCatch } from "@/utils/try-catch.js";
import { validateId } from "@/utils/validate-id.js";
import { type Response } from "express";

const setAvailability = tryCatch(async (req: RequestWithStudent, res: Response) => {
  const { doctorId, startTime, endTime } = req.body;

  if (!doctorId || !startTime || !endTime) throw new ErrorHandler(400, "All fields are required !");

  const start = new Date(startTime);
  const end = new Date(endTime);
  if (isNaN(start.getTime()) || isNaN(end.getTime()))
    throw new ErrorHandler(400, "Invalid time format !");
  if (start >= end) throw new ErrorHandler(400, "Start time must be before end time !");

  const overlap = await AvailabilityModel.findOne({
    doctorId,
    $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
  });

  if (overlap) throw new ErrorHandler(400, "Time slot overlaps existing availability !");

  const availability = await AvailabilityModel.create({ doctorId, startTime, endTime });
  return res.status(201).json(availability);
});

const getDoctorAvailability = tryCatch(async (req: RequestWithStudent, res: Response) => {
  const { doctorId } = req.params;

  if (!doctorId || !validateId(doctorId)) throw new ErrorHandler(400, "Invalid doctor ID !");

  const availability = await AvailabilityModel.find({ doctorId });

  return res.status(200).json(availability);
});

const deleteAvailability = tryCatch(async (req: RequestWithStudent, res: Response) => {
  const { availabilityId } = req.params;

  if (!availabilityId || !validateId(availabilityId))
    throw new ErrorHandler(400, "Invalid availability ID !");

  const availability = await AvailabilityModel.findByIdAndDelete(availabilityId);
  if (!availability) throw new ErrorHandler(404, "Availability not found !");

  await DoctorModel.findByIdAndUpdate(availability.doctorId, {
    $pull: { availability: availability._id },
  });

  return res.status(200).json({ message: "Availability deleted successfully !" });
});

export { deleteAvailability, getDoctorAvailability, setAvailability };
