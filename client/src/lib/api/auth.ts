import { apiRequest } from "./apiRequest";

export function registerUser(userData: {
  name: string;
  email: string;
  password: string;
  lastName: string;
}) {
  return apiRequest("post", "/auth/register", userData);
}
export function setupUser(userData: {
  email: string;
  password: string;
  id: string;
}) {
  return apiRequest("post", "/auth/setup-user", userData);
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

export const verifyUserSetupToken = (params: string) => {
  return apiRequest(
    "get",
    `/auth/verify-setup-token?setup_account_token=${params}`
  );
};

export const newUserSetup = (body: { password: string; id: string }) => {
  return apiRequest("post", `/auth/setup-user`, body);
};

export const sendVerificationToken = (body: {
  userId: string;
  userEmail: string;
}) => {
  return apiRequest("post", `/auth/send-verification-token`, body);
};
