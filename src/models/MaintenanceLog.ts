import { Schema, model, Document } from "mongoose";

export interface IMaintenanceLog extends Document {
  propertyId: string;
  propertyName: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  reportedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const maintenanceLogSchema = new Schema<IMaintenanceLog>(
  {
    propertyId: { type: String, required: true },
    propertyName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
    reportedBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<IMaintenanceLog>("MaintenanceLog", maintenanceLogSchema);
