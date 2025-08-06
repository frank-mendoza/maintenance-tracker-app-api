"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextStatusList = exports.canChangeStatus = void 0;
const constants_1 = require("./constants");
const canChangeStatus = ({ current, next, req, }) => {
    const copyReq = req;
    const role = copyReq.user?.role;
    let err = "";
    const config = constants_1.STATUS_TRANSITIONS[current];
    if (!config)
        err = "Invalid current status";
    if (!config.next.includes(next))
        err = `Cannot move from ${current} to ${next}`;
    if (!config.roles.includes(role))
        err = `${role} not allowed to change status from ${current}`;
    if (!req.body.comments && next === constants_1.TIKET_STATUS.DISCARDED) {
        err = "Comments are required for discarded status";
    }
    const nextStatus = constants_1.STATUS_TRANSITIONS[config.next[0]];
    return {
        error: err !== "" ? true : false,
        msg: err,
        nextStatus: nextStatus.next[0],
    };
};
exports.canChangeStatus = canChangeStatus;
exports.nextStatusList = {
    pending: "in_progress",
    approved: "resolved",
    in_progress: "resolved",
    resolved: "pending_approval",
    pending_approval: "completed",
};
