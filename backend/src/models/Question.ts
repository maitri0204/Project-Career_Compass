import mongoose, { Document, Schema } from "mongoose";

export interface IQuestion extends Document {
  testType: "PERSONALITY";
  partNumber: number;
  partName: string;
  questionNumber: number;
  questionText: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
}

const questionSchema = new Schema<IQuestion>(
  {
    testType: {
      type: String,
      enum: ["PERSONALITY"],
      required: true,
    },
    partNumber: { type: Number, required: true },
    partName: { type: String, required: true },
    questionNumber: { type: Number, required: true },
    questionText: { type: String, required: true },
    options: {
      type: [
        {
          label: { type: String, required: true },
          text: { type: String, required: true },
        },
      ],
      required: true,
    },
    correctAnswer: { type: String, default: "" },
  },
  { timestamps: true }
);

questionSchema.index(
  { testType: 1, partNumber: 1, questionNumber: 1 },
  { unique: true }
);

export default mongoose.model<IQuestion>("Question", questionSchema);
