import mongoose, { Schema, model, Document } from "mongoose";
import { TIKET_STATUS } from "../utils/constants";
import { IUser } from "./User";

export interface IMaintenanceLog extends Document {
  propertyId: mongoose.Types.ObjectId | string;
  title: string;
  description: string;
  status: (typeof TIKET_STATUS)[keyof typeof TIKET_STATUS];
  nextStatus?: (typeof TIKET_STATUS)[keyof typeof TIKET_STATUS];
  reportedBy: mongoose.Types.ObjectId | string | IUser;
  assignedTo: mongoose.Types.ObjectId | string | IUser;
  completedBy?: mongoose.Types.ObjectId | string | IUser;
  images: { path: string; public_id: string }[];
  comments?: string; // Optional field for discarded status
  createdAt: Date;
  updatedAt: Date;
}

const maintenanceLogSchema = new Schema<IMaintenanceLog>(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: "",
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    comments: { type: String, default: null },
    status: {
      type: String,
      enum: Object.values(TIKET_STATUS),
      default: "pending",
    },
    nextStatus: {
      type: String,
      enum: Object.values(TIKET_STATUS),
      default: TIKET_STATUS.APPROVED,
    },
    images: [
      {
        path: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: "",
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: "",
    },
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default model<IMaintenanceLog>("MaintenanceLog", maintenanceLogSchema);
