import mongoose, { Schema, Document } from "mongoose";

interface responseDoc extends Document {
  userId: string;
  walletAddress: string;
  endPoint: string;
  value: string;
}

const responseSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    walletAddress: { type: String, required: true, index: true },
    endPoint: { type: String, required: true, index: true },
    value: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const UserResponse = mongoose.model<responseDoc>(
  "UserResponse",
  responseSchema
);

export { UserResponse };
