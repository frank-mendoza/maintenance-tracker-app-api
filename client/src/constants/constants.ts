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

export const PROPERTY_STATUS = {
  pending: {
    label: "Pending",
    color: "orange",
  },
  in_progress: {
    label: "In Progress",
    color: "yellow",
  },
  completed: {
    label: "Completed",
    color: "green",
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
