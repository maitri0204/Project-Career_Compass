import mongoose, { Document, Schema } from "mongoose";

export interface ITestResult extends Document {
  student: mongoose.Types.ObjectId;
  status: "IN_PROGRESS" | "COMPLETED";
  answers: Map<string, string>;
  personalityType?: string;
  totalScore: number;
  submittedAt?: Date;
}

const testResultSchema = new Schema<ITestResult>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["IN_PROGRESS", "COMPLETED"],
      default: "IN_PROGRESS",
    },
    answers: {
      type: Map,
      of: String,
      default: () => new Map(),
    },
    personalityType: { type: String },
    totalScore: { type: Number, default: 0 },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<ITestResult>("TestResult", testResultSchema);
