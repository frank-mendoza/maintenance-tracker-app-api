import { apiRequest } from "./apiRequest";

export const fetchUser = async () => {
  return apiRequest("get", "/user");
};
