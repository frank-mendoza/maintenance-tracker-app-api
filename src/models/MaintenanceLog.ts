import mongoose, { Schema, model, Document } from "mongoose";

export interface IMaintenanceLog extends Document {
  propertyId: mongoose.Types.ObjectId | string;

  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  reportedBy: mongoose.Types.ObjectId | string;
  assignedTo: mongoose.Types.ObjectId | string;
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
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
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
  },
  { timestamps: true }
);

export default model<IMaintenanceLog>("MaintenanceLog", maintenanceLogSchema);
