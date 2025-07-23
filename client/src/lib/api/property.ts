/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiRequest } from "./apiRequest";

export const fetchProperties = (queryObject: any) => {
  const filteredParams = Object.fromEntries(
    Object.entries(queryObject)
      .filter(([_, value]) => value !== "")
      .map(([key, value]) => [key, String(value)])
  );

  const searchParams = new URLSearchParams(filteredParams);

  return apiRequest("get", `/property/properties?${searchParams.toString()}`);
};

export const propertyMutation = (body: {
  name: string;
  description: string;
  town: string;
  province: string;
  rent: number;
  units: number;
  type: string;
  images: File[];
  isUpdate?: boolean;
  id?: string; // Optional for create, required for update
}) => {
  const formData = new FormData();

  // Append regular fields
  formData.append("name", body.name);
  formData.append("description", body.description);
  formData.append("rent", String(body.rent));
  formData.append("type", body.type);
  formData.append("units", String(body.units));

  // For nested fields like location
  formData.append("location[town]", body.town);
  formData.append("location[province]", body.province);

  // Append multiple images
  if (body.images && body.images.length > 0) {
    Array.from(body.images).forEach((file: File) => {
      formData.append("images", file); // name must match .array('images') in backend
    });
  }
  return apiRequest(
    body.isUpdate ? "patch" : "post",
    `/property/${body.isUpdate ? body.id : ""}`,
    formData
  );
};

export const getPropertyDetails = (id: string) => {
  return apiRequest("get", `/property/${id}`);
};
