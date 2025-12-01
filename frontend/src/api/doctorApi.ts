import axiosClient from "./axiosClient";

export const doctorApi = {
  getAllDoctors: () => axiosClient.get("/api/doctor/get-all-doctors"),
};
