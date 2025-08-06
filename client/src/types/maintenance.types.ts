import { PROPERTY_STATUS } from "@/lib/constants/constants";
import { IProperty } from "./property.types";
import { User } from "./user.type";

export type MaintenanceLog = {
  _id: string;
  propertyId: string | null;
  title: string;
  description: string;
  status: keyof typeof PROPERTY_STATUS;
  nextStatus: keyof typeof PROPERTY_STATUS;
  assignedTo: User;
  reportedBy: User;
  completedBy?: User;
  comments?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  property: IProperty;
  images?: {
    path: string;
    public_id: string;
  }[];
  index: number;
};
