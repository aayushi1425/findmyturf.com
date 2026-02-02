import api from "../config/api";

export const registerUser = (data) =>
  api.post("/auth/register/user/", data);

export const registerOwner = (data) =>
  api.post("/auth/register/owner/", data);

export const loginApi = (data) =>
  api.post("/auth/login/", data);
