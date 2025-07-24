import mongoose, { Schema, model, Document } from "mongoose";
import { IProperty } from "./Property";

export type UserRole = "tenant" | "landlord" | "technician";

export interface IUser extends Document {
  name: string;
  lastName: string;
  email: string;
  password?: string; // store hashed password
  role: UserRole;
  phone: string;
  assignedRequests?: {
    status: "pending" | "in_progress" | "completed";
    property: mongoose.Types.ObjectId | IProperty;
  }[]; // maintenance IDs (for technicians)
  propertiesOwned?: string[]; // property IDs (for landlords)
  createdAt: Date;
  images: { path: string; public_id: string }[];
  manuallyCreated?: boolean; // flag to indicate if the user was created manually
  isVerified: { type: Boolean; default: false };
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    manuallyCreated: { type: Boolean, default: false },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false, select: false },
    role: {
      type: String,
      enum: ["tenant", "landlord", "technician"],
      default: "landlord",
    },
    assignedRequests: [
      {
        status: { type: String, required: true, default: "pending" },
        property: { type: Schema.Types.ObjectId, ref: "Property" },
      },
    ],
    propertiesOwned: [{ type: Schema.Types.ObjectId, ref: "Property" }],
    images: [
      {
        path: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
