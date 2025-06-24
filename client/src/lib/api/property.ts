/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiRequest } from "./apiRequest";

export const fetchProperties = async (queryObject: any) => {
  const filteredParams = Object.fromEntries(
    Object.entries(queryObject)
      .filter(([_, value]) => value !== "")
      .map(([key, value]) => [key, String(value)])
  );

  const searchParams = new URLSearchParams(filteredParams);

  return apiRequest("get", `/property/all?${searchParams.toString()}`);
};
