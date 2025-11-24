export const BASE_URL = "https://bookngo-zrbr.vercel.app/api";

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${BASE_URL}/users/register`,
    LOGIN: `${BASE_URL}/users/login`,
    ADMIN_LOGIN: `${BASE_URL}/admin/login`,
    PROFILE: `${BASE_URL}/users/profile`,
  },

  BUSES: {
    GET_ALL: `${BASE_URL}/buses`,
    GET_BY_ID: (id) => `${BASE_URL}/buses/${id}`,
    CREATE: `${BASE_URL}/buses`,
    UPDATE: (id) => `${BASE_URL}/buses/${id}`,
    DELETE: (id) => `${BASE_URL}/buses/${id}`,
    SEARCH: `${BASE_URL}/buses/search`,
  },

  BOOKINGS: {
    CREATE: `${BASE_URL}/bookings`,
    GET_BY_USER: `${BASE_URL}/bookings/mybookings`,
    GET_BY_ID: (id) => `${BASE_URL}/bookings/${id}`,

    // ⭐ ADD THIS FOR CANCEL BUS BOOKING
    CANCEL: (id) => `${BASE_URL}/bookings/cancel/${id}`,
  },

  PACKAGE_BOOKING: {
    CREATE: `${BASE_URL}/package-booking`,
    GET_BY_USER: `${BASE_URL}/package-booking/me`,
    GET_BY_ID: (id) => `${BASE_URL}/package-booking/${id}`,

    // ⭐ ADD THIS FOR CANCEL PACKAGE BOOKING
    CANCEL: (id) => `${BASE_URL}/package-booking/cancel/${id}`,
  },
};
