import axiosClient from "./axiosClient";

export const studentApi = {
  updatePassword: (oldPassword: string, newPassword: string) =>
    axiosClient.post("/api/student/update-password", {
      oldPassword,
      newPassword,
    }),
  getAppointments: () => axiosClient.get("/api/student/get-appointments/me"),
};
