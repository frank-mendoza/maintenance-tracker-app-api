import mongoose, { Document, model, Schema } from "mongoose";

export interface INotification extends Document {
  ticket: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const notificationLogSchema = new Schema<INotification>(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceLog",
      default: "",
    },
  },
  { timestamps: true }
);

export default model<INotification>("NotificationLog", notificationLogSchema);
