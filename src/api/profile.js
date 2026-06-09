import axiosInstance from "./axios";

export const getTestHistory = async () => {
  return axiosInstance.get("/api/quiz/history");
};

export const getMentorBookings = async () => {
  return axiosInstance.get("/api/mentor-booking/my-mentor-bookings");
};

export const getSubscriptions = async () => {
  return axiosInstance.get("/api/mentor-booking/my-subscriptions");
};