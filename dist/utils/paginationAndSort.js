"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationAndSort = void 0;
const getPaginationAndSort = ({ sort, page = 1, limit = 10, sortOptions = {}, }) => {
    const sortKey = sortOptions[sort || ""] || sortOptions["newest"];
    const skip = (page - 1) * limit;
    return { sortKey, skip, limit };
};
exports.getPaginationAndSort = getPaginationAndSort;
