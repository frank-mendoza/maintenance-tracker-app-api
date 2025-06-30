import axios, { AxiosRequestConfig } from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function apiRequest(
  method: "get" | "post" | "put" | "delete",
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
) {
  const isFormData = data instanceof FormData;
  try {
    const response = await axios({
      method,
      url: `${backendUrl}${endpoint}`,
      data,
      withCredentials: true,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...config?.headers,
      },
      ...config,
    });
    return response.data;
  } catch (err: any) {
    console.error(`API ${method.toUpperCase()} ${endpoint} failed:`, err);
    return err.response?.data || { msg: "Request failed", error: true };
  }
}
