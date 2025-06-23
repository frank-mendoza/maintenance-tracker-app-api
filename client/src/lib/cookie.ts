"use server";
import { cookies } from "next/headers";

interface SetAuthCookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "strict" | "lax" | "none";
  maxAge: number;
}

export async function setAuthCookie(token: string): Promise<void> {
  const options: SetAuthCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day
  };
  (await cookies()).set("token", token, options);
}
