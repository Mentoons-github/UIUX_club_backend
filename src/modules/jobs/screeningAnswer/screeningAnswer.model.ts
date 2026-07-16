import mongoose from "mongoose";

const ScreeningAnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  question: {
    type: String,
    required: true,
    trim: true,
  },
  answer: {
    type: String,
    required: true,
    trim: true,
  },
});

const ScreeningAnswerModel = mongoose.model(
  "ScreeningAnswer",
  ScreeningAnswerSchema,
);

export default ScreeningAnswerModel;
