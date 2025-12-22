import axiosClient from "./axiosClient";

export const appointmentApi = {
  bookAppointment: (payload: {
    doctorId: string;
    date: string;
    startTime: string;
    endTime: string;
    reason: string;
  }) => axiosClient.post("/api/appointment/book", payload),
};
