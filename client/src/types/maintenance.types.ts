import { PROPERTY_STATUS } from "@/constants/constants";
import { IProperty } from "./property.types";
import { User } from "./user.type";

export type MaintenanceLog = {
  _id: string;
  propertyId: string | null;
  title: string;
  description: string;
  status: keyof typeof PROPERTY_STATUS;
  assignedTo: User;
  reportedBy: User;
  createdAt: string;
  updatedAt: string;
  __v: number;
  property: IProperty;
  index: number;
};
