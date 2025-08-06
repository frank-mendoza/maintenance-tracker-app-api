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
  { label: "Approved", value: "approved" },
  { label: "Resolved", value: "resolved" },
  { label: "Pending Approval", value: "pending_approval" },
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
    buttonLabel: "Pending",
    color: "orange",
  },
  pending_approval: {
    label: "Pending Approval",
    value: "pending_approval",
    buttonLabel: "Pending Approval",
    color: "orange",
  },
  in_progress: {
    label: "In Progress",
    value: "in_progress",
    buttonLabel: "Start",
    color: "blue",
  },
  resolved: {
    label: "Resolved",
    value: "resolved",
    buttonLabel: "Resolved",
    color: "green",
  },
  completed: {
    label: "Completed",
    value: "completed",
    buttonLabel: "Complete",
    color: "green",
  },
  discarded: {
    label: "Discarded",
    value: "discarded",
    buttonLabel: "Discard",
    color: "red",
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

export const TIKET_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  DISCARDED: "discarded",
  APPROVED: "approved",
  RESOLVED: "resolved",
  PENDING_APPROVAL: "pending_approval",
};
