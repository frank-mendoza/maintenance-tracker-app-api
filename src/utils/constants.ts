import { IUser } from "../models/User";

export const APRTMENT_TYPE = {
  APARTMENT: "apartment",
  HOUSE: "house",
  BOARDING_HOUSE: "boarding house",
  CONDO: "condo",
};

export const USER_TYPES = {
  ADMIN: "admin",
  TENANT: "tenant",
  LANDLORD: "landlord",
  TECHINICIAN: "technician",
};

export const TIKET_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  DISCARDED: "discarded",
  APPROVED: "approved",
  RESOLVED: "resolved",
  PENDING_APPROVAL: "pending_approval",
};

type Role = "tenant" | "landlord" | "technician";
type Status = (typeof TIKET_STATUS)[keyof typeof TIKET_STATUS];

export const STATUS_TRANSITIONS: Record<
  Status,
  { next: Status[]; roles: IUser["role"][] }
> = {
  pending: {
    next: ["approved", "discarded"],
    roles: ["tenant", "landlord"],
  },
  approved: {
    next: ["in_progress"],
    roles: ["technician"],
  },
  in_progress: {
    next: ["resolved"],
    roles: ["technician"],
  },
  resolved: {
    next: ["completed"],
    roles: ["landlord"],
  },
  pending_approval: {
    next: ["completed", "discarded"],
    roles: ["landlord"],
  },
  completed: {
    next: [],
    roles: [],
  },
  discarded: {
    next: [],
    roles: [],
  },
};
