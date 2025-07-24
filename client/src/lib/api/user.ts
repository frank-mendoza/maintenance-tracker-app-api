/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiRequest } from "./apiRequest";

export const fetchUser = async () => {
  return apiRequest("get", "/user");
};

export const fetchUsers = (queryObject: any) => {
  const filteredParams = Object.fromEntries(
    Object.entries(queryObject)
      .filter(([_, value]) => value !== "")
      .map(([key, value]) => [key, String(value)])
  );

  const searchParams = new URLSearchParams(filteredParams);

  return apiRequest("get", `/user/all-users?${searchParams.toString()}`);
};

export const userMutation = (body: {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
  isUpdate?: boolean;
  images?: File[];
  id?: string; // Optional for create, required for update
}) => {
  const formData = new FormData();

  // Append regular fields
  formData.append("name", body.name);
  formData.append("lastName", body.lastName);
  formData.append("phone", String(body.phone));
  formData.append("email", body.email);
  formData.append("role", String(body.role));

  // Append multiple images
  if (body.images && body.images.length > 0) {
    Array.from(body.images).forEach((file: File) => {
      formData.append("images", file); // name must match .array('images') in backend
    });
  }

  return apiRequest(
    body.isUpdate ? "patch" : "post",
    `/user/${body.isUpdate ? body.id : "create"}`,
    formData
  );
};

export const removeUser = (id: string) => apiRequest("delete", `/user/${id}`);
