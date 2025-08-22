import API from "./api";

export const signupUser = async (data) => {
  const res = await API.post("/auth/signup", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};
