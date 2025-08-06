"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS_TRANSITIONS = exports.TIKET_STATUS = exports.USER_TYPES = exports.APRTMENT_TYPE = void 0;
exports.APRTMENT_TYPE = {
    APARTMENT: "apartment",
    HOUSE: "house",
    BOARDING_HOUSE: "boarding house",
    CONDO: "condo",
};
exports.USER_TYPES = {
    ADMIN: "admin",
    TENANT: "tenant",
    LANDLORD: "landlord",
    TECHINICIAN: "technician",
};
exports.TIKET_STATUS = {
    PENDING: "pending",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
    DISCARDED: "discarded",
    APPROVED: "approved",
    RESOLVED: "resolved",
    PENDING_APPROVAL: "pending_approval",
};
exports.STATUS_TRANSITIONS = {
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
