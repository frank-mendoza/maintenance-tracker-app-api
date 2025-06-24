import axios, { AxiosRequestConfig } from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function apiRequest<T>(
  method: "get" | "post" | "put" | "delete",
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T | { msg: string }> {
  try {
    const response = await axios({
      method,
      url: `${backendUrl}${endpoint}`,
      data,
      withCredentials: true,
      ...config,
    });

    return response.data;
  } catch (err: any) {
    console.error(`API ${method.toUpperCase()} ${endpoint} failed:`, err);
    return err.response?.data || { msg: "Request failed", error: true };
  }
}
