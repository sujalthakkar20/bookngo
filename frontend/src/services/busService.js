import API from "../utils/api";

// Get all buses (optionally filter by from/to/date)
export const getBuses = async (from, to, date) => {
  const { data } = await API.get("/buses", { params: { from, to, date } });
  return data;
};

// Get single bus details
export const getBusById = async (id) => {
  const { data } = await API.get(`/buses/${id}`);
  return data;
};

// Add new bus (Admin only)
export const addBus = async (busData) => {
  const { data } = await API.post("/buses", busData);
  return data;
};

// Update bus (Admin only)
export const updateBus = async (id, busData) => {
  const { data } = await API.put(`/buses/${id}`, busData);
  return data;
};

// Delete bus (Admin only)
export const deleteBus = async (id) => {
  const { data } = await API.delete(`/buses/${id}`);
  return data;
};
