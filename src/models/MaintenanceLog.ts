import mongoose, { Schema, model, Document } from "mongoose";

export interface IMaintenanceLog extends Document {
  propertyId: mongoose.Types.ObjectId | string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "discarded";
  reportedBy: mongoose.Types.ObjectId | string;
  assignedTo: mongoose.Types.ObjectId | string;
  completedBy?: mongoose.Types.ObjectId | string;
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
      enum: ["pending", "in_progress", "completed", "discarded"],
      default: "pending",
    },
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
