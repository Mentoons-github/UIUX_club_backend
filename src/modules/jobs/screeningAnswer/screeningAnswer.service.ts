import { ScreeningAnswer } from "../applications";
import ScreeningAnswerModel from "./screeningAnswer.model";

export const parseScreeningAnswers = (screeningAnswers?: string) => {
  if (!screeningAnswers) return [];

  try {
    return JSON.parse(screeningAnswers);
  } catch {
    return [];
  }
};

export const createScreeningAnswersService = async (
  screeningAnswers: ScreeningAnswer[],
) => {
  const createdAnswers =
    await ScreeningAnswerModel.insertMany(screeningAnswers);

  return createdAnswers;
};

