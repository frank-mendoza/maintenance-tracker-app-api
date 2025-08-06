import { Request } from "express";
import { IUser } from "../models/User";
import { STATUS_TRANSITIONS, TIKET_STATUS } from "./constants";

type ValidateStatusChangeParams = {
  current: (typeof TIKET_STATUS)[keyof typeof TIKET_STATUS];
  next: (typeof TIKET_STATUS)[keyof typeof TIKET_STATUS];
  req: Request;
  //   hasProof?: boolean;
};

export const canChangeStatus = ({
  current,
  next,
  req,
}: ValidateStatusChangeParams) => {
  const copyReq = req as any;
  const role = copyReq.user?.role as IUser["role"];
  let err = "";
  const config = STATUS_TRANSITIONS[current];

  if (!config) err = "Invalid current status";

  if (!config.next.includes(next))
    err = `Cannot move from ${current} to ${next}`;

  if (!config.roles.includes(role))
    err = `${role} not allowed to change status from ${current}`;

  if (!req.body.comments && next === TIKET_STATUS.DISCARDED) {
    err = "Comments are required for discarded status";
  }

  const nextStatus = STATUS_TRANSITIONS[config.next[0]];

  return {
    error: err !== "" ? true : false,
    msg: err,
    nextStatus: nextStatus.next[0],
  };
};

export const nextStatusList = {
  pending: "in_progress",
  approved: "resolved",
  in_progress: "resolved",
  resolved: "pending_approval",
  pending_approval: "completed",
};
