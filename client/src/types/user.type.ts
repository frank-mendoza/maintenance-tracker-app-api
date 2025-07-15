export type UserRole = "tenant" | "landlord" | "technician";

export interface IUser {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone: string;
  assignedRequests?: string[]; // maintenance IDs (for technicians)
  propertiesOwned?: string[]; // property IDs (for landlords)
  createdAt: Date;
  isVerified: boolean;
}
