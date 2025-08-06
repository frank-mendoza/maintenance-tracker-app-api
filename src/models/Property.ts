import mongoose, { Schema, Document } from "mongoose";

export interface IProperty extends Document {
  name: string;
  location: {
    town: string;
    province: string;
  };
  description?: string;
  active: boolean;
  rent: number; // monthly rent per unit
  type: "apartment" | "house" | "boarding house" | "condo" | "hotel"; // e.g., "Apartments", "House", etc.
  units: number; // number of apartments or rooms
  status: "active" | "inactive";
  tenants: mongoose.Types.ObjectId[];
  images: { path: string; public_id: string }[];
}

const PropertySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    active: { type: Boolean, required: true, default: true },
    location: {
      town: { type: String, required: true },
      province: { type: String, required: true },
    },
    description: { type: String, required: true },
    rent: { type: Number, required: true },
    type: { type: String, required: true, default: "apartment" },
    units: { type: Number, required: true, default: 1 },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    tenants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant",
        default: [],
      },
    ],
    images: [
      {
        path: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IProperty>("Property", PropertySchema);
