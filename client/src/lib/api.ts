/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

// e.g. in your Register component
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
  lastName: string;
}) {
  try {
    const res = await axios.post(`${backendUrl}/auth/register`, userData, {
      withCredentials: true,
    });

    return res.data;
  } catch (err: any) {
    console.error("Register failed:", err);
    return (
      err.response || {
        msg: "Register failed",
      }
    );
  }
}
export async function loginUser(userData: { email: string; password: string }) {
  try {
    const res = await axios.post(`${backendUrl}/auth/login`, userData, {
      withCredentials: true,
    });

    return res.data;
  } catch (err: any) {
    return (
      err.response || {
        msg: "Login failed",
      }
    );
  }
}

export const fetchUser = async () => {
  try {
    const res = await axios.get(`${backendUrl}/user`, {
      withCredentials: true,
    });

    return res;
  } catch (err: any) {
    console.error("Fetch user failed:", err);
    return (
      err.response || {
        msg: "Fetch user failed",
      }
    );
  }
};

export const logoutUser = async () => {
  try {
    const res = await axios.get(`${backendUrl}/auth/logout`, {
      withCredentials: true,
    });

    return res.data;
  } catch (err: any) {
    console.error("Logout failed:", err);
    return (
      err.response || {
        msg: "Logout failed",
      }
    );
  }
};

export const verifyUserEmail = async (params: string) => {
  try {
    const res: any = await axios.get(
      `${backendUrl}/auth/verify-email?verificationToken=${params}`,
      {
        withCredentials: true,
      }
    );

    return res.data;
  } catch (err: any) {
    console.error("Verification failed:", err);
    const errMsg = err?.response?.data?.isVerified
      ? err?.response?.data?.msg
      : "Verification failed";
    return {
      error: true,
      msg: errMsg,
    };
  }
};
