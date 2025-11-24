import API from "../utils/api";

// Register a new user
export const register = async (name, email, password, phone) => {
  const { data } = await API.post("/users/register", {
    name,
    email,
    password,
    phone,
  });
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data));
  return data;
};

// Login existing user
export const login = async (email, password) => {
  const { data } = await API.post("/users/login", { email, password });
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data));
  return data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Get user profile (protected route)
export const getProfile = async () => {
  const { data } = await API.get("/users/profile");
  return data;
};
