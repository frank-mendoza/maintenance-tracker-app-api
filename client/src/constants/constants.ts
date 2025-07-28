export const MAINTENANCE_STATUS = {
  pending: {
    label: "Pending",
    color: "#6fe099",
  },
  in_progress: {
    label: "In Progress",
    color: "#fbbf24",
  },
  completed: {
    label: "Completed",
    color: "#f87171",
  },
} as const;

export const ROLES = [
  { label: "Tenant", value: "tenant" },
  { label: "Landlord", value: "landlord" },
  { label: "Technician", value: "technician" },
];
export const TicketStatus = [
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Discarded", value: "discarded" },
];

export const ROLES_TYPES = {
  TENANT: "tenant",
  LANDLORD: "landlord",
  TECH: "technician",
};

export const PROPERTY_STATUS = {
  pending: {
    label: "Pending",
    value: "pending",
    color: "orange",
  },
  in_progress: {
    label: "In Progress",
    value: "in_progress",
    color: "yellow",
  },
  completed: {
    label: "Completed",
    value: "completed",
    color: "green",
  },
  discarded: {
    label: "Discarded",
    value: "discarded",
    color: "grey",
  },
} as const;

export const USER_STATUS = {
  Yes: {
    label: "Verified",
    color: "green",
  },
  No: {
    label: "Unverified",
    color: "red",
  },
} as const;
