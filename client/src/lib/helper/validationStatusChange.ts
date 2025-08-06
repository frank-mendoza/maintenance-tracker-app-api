import { ROLES_TYPES, TIKET_STATUS } from "@/lib/constants/constants";
import { MaintenanceLog } from "@/types/maintenance.types";
import { User } from "@/types/user.type";

type Status = (typeof TIKET_STATUS)[keyof typeof TIKET_STATUS];
type Role = "tenant" | "landlord" | "technician";

export const STATUS_TRANSITIONS: Record<
  Status,
  { next: Status[]; roles: Role[] }
> = {
  pending: {
    next: ["approved"],
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
    next: ["completed"],
    roles: ["landlord"],
  },
  completed: {
    next: [],
    roles: [],
  },
  discarded: {
    next: ["discarded"],
    roles: ["technician", "landlord"],
  },
};

export const canChangeStatus = ({
  current,
  next,
  role,
}: {
  current: Status;
  next: Status;
  role: Role;
  hasProof?: boolean;
}): string | null => {
  const config = STATUS_TRANSITIONS[current];
  if (!config) return "Invalid current status";

  if (!config.next.includes(next))
    return `Cannot move from ${current} to ${next}`;
  if (!config.roles.includes(role))
    return `${role} not allowed to change status from ${current}`;

  //   if (current === "in_progress" && next === "resolved" && !hasProof) {
  //     return "Proof is required to resolve the request";
  //   }

  return null; // ✅ valid
};

type StatusProps = {
  label: string;
  color: string;
  value: string;
  buttonLabel: string;
};

export type TicketStatus = keyof typeof TIKET_STATUS;
export const TICKET_STATUS_PROPS: Record<TicketStatus, StatusProps> = {
  PENDING: {
    label: "Waiting for Landlord Action",
    color: "orange",
    value: TIKET_STATUS.PENDING_APPROVAL,
    buttonLabel: "Approve Request",
  },
  APPROVED: {
    label: "Ready for technician review",
    color: "purple",
    value: TIKET_STATUS.APPROVED,
    buttonLabel: "Start Work",
  },
  IN_PROGRESS: {
    label: "Work in Progress",
    color: "blue",
    value: TIKET_STATUS.IN_PROGRESS,
    buttonLabel: "Mark as Resolved",
  },
  RESOLVED: {
    label: "Resolved - Awaiting Approval",
    color: "cyan",
    value: TIKET_STATUS.RESOLVED,
    buttonLabel: "Approve Completion",
  },
  PENDING_APPROVAL: {
    label: "Waiting for Landlord Approval",
    color: "orange",
    value: TIKET_STATUS.PENDING,
    buttonLabel: "Submit for Completion",
  },
  COMPLETED: {
    label: "Completed",
    color: "green",
    value: TIKET_STATUS.COMPLETED,
    buttonLabel: "Complete",
  },
  DISCARDED: {
    label: "Discarded",
    color: "red",
    value: TIKET_STATUS.DISCARDED,
    buttonLabel: "Discard",
  },
};

export const getAllowedNextStatuses = (
  current: (typeof TIKET_STATUS)[keyof typeof TIKET_STATUS],
  role: User["role"]
): Status[] => {
  const config = STATUS_TRANSITIONS[current];

  if (!config || !config.roles.includes(role)) return [];
  return config.next;
};

export const isDiscardVisible = (
  status: MaintenanceLog["status"] | null,
  user: User | null
) => {
  const statuses = [
    TICKET_STATUS_PROPS.PENDING.value,
    TICKET_STATUS_PROPS.IN_PROGRESS.value,
    TICKET_STATUS_PROPS.PENDING_APPROVAL.value,
  ];

  return (
    statuses.includes(status as string) &&
    (user?.role === ROLES_TYPES.TECH || user?.role === ROLES_TYPES.LANDLORD)
  );
};
