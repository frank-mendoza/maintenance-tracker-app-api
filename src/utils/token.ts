import jwt from "jsonwebtoken";

interface IPayload {
  [key: string]: any;
}

export const createJWT = (payload: any) => {
  const secret: any = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }
  const token: string = jwt.sign(payload, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN as any) || "1d",
  });

  return token;
};

export const verifyJWT = (token: string): IPayload => {
  const secret: string | undefined = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }
  const decoded = jwt.verify(token, secret) as IPayload;
  return decoded;
};
