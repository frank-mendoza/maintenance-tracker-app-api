import { Document, model, Schema } from "mongoose";

export interface IContract extends Document {
  title: string;
  parties: string[];
  content: string;
  dateIssued: Date;
  validUntil?: Date;
  signed: boolean;
}

const contractSchema = new Schema<IContract>(
  {
    title: { type: String, required: true },
    parties: { type: [String], required: true },
    content: { type: String, required: true },
    dateIssued: { type: Date, default: Date.now },
    validUntil: { type: Date },
    signed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
export default model<IContract>("Contract", contractSchema);
