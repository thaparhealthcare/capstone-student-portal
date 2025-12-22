import axiosClient from "./axiosClient";

//dont delete
export const doctorApi = {
  getAllDoctors: () => axiosClient.get("/api/doctor/get-all-doctors"),
};
