import { apiRequest } from "./apiRequest";

export function registerUser(userData: {
  name: string;
  email: string;
  password: string;
  lastName: string;
}) {
  return apiRequest("post", "/auth/register", userData);
}

export function loginUser(userData: { email: string; password: string }) {
  return apiRequest("post", "/auth/login", userData);
}

export const logoutUser = () => {
  return apiRequest("get", "/auth/logout");
};

export const verifyUserEmail = (params: string) => {
  return apiRequest("get", `/auth/verify-email?verificationToken=${params}`);
};
