export type UserRole = "tenant" | "landlord" | "technician";

export interface User {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  password: string; // store hashed password
  role: "tenant" | "landlord" | "technician";
  assignedRequests?: string[]; // maintenance IDs (for technicians)
  propertiesOwned?: string[]; // property IDs (for landlords)
  createdAt: Date;
  updatedAt: Date;
  phone: string;
  images?: {
    path: string;
    public_id: string;
  }[];
  isVerified?: boolean;
}
