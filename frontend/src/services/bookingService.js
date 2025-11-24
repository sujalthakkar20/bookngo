import API from "../utils/api"; // Axios instance with token

const bookingService = {
  // Fetch bookings for the currently logged-in user
  getUserBookings: async () => {
    try {
      const { data } = await API.get("/bookings/mybookings");
      return data;
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      throw error;
    }
  },
};

export default bookingService;
