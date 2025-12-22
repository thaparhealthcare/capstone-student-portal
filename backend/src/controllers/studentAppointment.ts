import axios from "axios";
import { Response } from "express";

/* ---------------- ALL ---------------- */
export const getStudentAppointmentsForSB = async (req: any, res: Response) => {
  try {
    const studentId = req.studentId;
    const DOCTOR_API = process.env.DOCTOR_API_URL;
    const response = await axios.get(`${DOCTOR_API}/doctor/appointments/student/${studentId}`, {
      withCredentials: true,
    });

    res.status(200).json(response.data);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};

/* ---------------- UPCOMING ---------------- */
export const getUpcomingStudentAppointments = async (req: any, res: Response) => {
  try {
    const studentId = req.studentId;
    const DOCTOR_API = process.env.DOCTOR_API_URL;
    const response = await axios.get(
      `$${DOCTOR_API}}/doctor/appointments/student/${studentId}/upcoming`,
      { withCredentials: true }
    );

    res.status(200).json(response.data);
  } catch {
    console.log("hii");
    res.status(500).json({ success: false });
  }
};

/* ---------------- PAST ---------------- */
export const getPastStudentAppointments = async (req: any, res: Response) => {
  try {
    const studentId = req.studentId;
    const DOCTOR_API = process.env.DOCTOR_API_URL;
    const response = await axios.get(
      `${DOCTOR_API}/doctor/appointments/student/${studentId}/past`,
      { withCredentials: true }
    );

    res.status(200).json(response.data);
  } catch {
    res.status(500).json({ success: false });
  }
};
