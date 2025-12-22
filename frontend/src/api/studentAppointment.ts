import axiosClient from "./axiosClient";

export const studentAppointmentApi = {
  getAll: () => axiosClient.get("/api/student/appointments"),
  getUpcoming: () => axiosClient.get("/api/student/appointments/upcoming"),
  getPast: () => axiosClient.get("/api/student/appointments/past"),
};
