import { Schema, model, Document } from "mongoose";

export type UserRole = "tenant" | "landlord" | "technician";

export interface IUser extends Document {
  name: string;
  lastName: string;
  email: string;
  password: string; // store hashed password
  role: UserRole;
  assignedRequests?: string[]; // maintenance IDs (for technicians)
  propertiesOwned?: string[]; // property IDs (for landlords)
  createdAt: Date;
  isVerified: { type: Boolean; default: false };
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["tenant", "landlord", "technician"],
      default: "landlord",
    },
    assignedRequests: [{ type: Schema.Types.ObjectId, ref: "MaintenanceLog" }],
    propertiesOwned: [{ type: Schema.Types.ObjectId, ref: "Property" }],
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
