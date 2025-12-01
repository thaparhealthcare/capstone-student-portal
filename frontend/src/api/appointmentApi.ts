import axiosClient from "./axiosClient";

export const appointmentApi = {
  bookAppointment: (
    doctorId: string,
    appointmentStartTime: string,
    appointmentEndTime: string,
    reason: string
  ) =>
    axiosClient.post("/api/appointment/book-appointment", {
      doctorId,
      appointmentStartTime,
      appointmentEndTime,
      reason,
    }),
  updateStatus: (appointmentId: string, status: string, notes?: string) =>
    axiosClient.patch(
      `/api/appointment/update-appointment-status/${appointmentId}`,
      { status, notes }
    ),
  cancelAppointment: (appointmentId: string) =>
    axiosClient.delete(`/api/appointment/cancel-appointment/${appointmentId}`),
};
