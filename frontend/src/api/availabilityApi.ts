import axiosClient from "./axiosClient";

export const availabilityApi = {
  getDoctorAvailability: (doctorId: string) =>
    axiosClient.get(`/api/availability/get-availability/${doctorId}`),
};
