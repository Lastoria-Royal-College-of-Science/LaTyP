import { DIFFICULTY_INFO, type Problem } from "../data/problems";

/** Effective formula length, excluding whitespace. */
export function latexLength(problem: Problem): number {
  return problem.latex.replace(/\s+/g, "").length;
}

export type ScoreBreakdown = {
  /** Base points = formula length × difficulty multiplier × 10. */
  base: number;
  /** Time bonus = remaining seconds × difficulty multiplier × 5. */
  timeBonus: number;
  total: number;
};

/**
 * Calculates the score breakdown for a correctly answered question.
 * Adds a time bonus based on the remaining time to the question's base points.
 */
export function scoreBreakdownFor(
  problem: Problem,
  remainingSeconds: number,
): ScoreBreakdown {
  const mult = DIFFICULTY_INFO[problem.difficulty].multiplier;
  const base = Math.round(latexLength(problem) * mult * 10);
  const timeBonus = Math.round(Math.max(0, remainingSeconds) * mult * 5);
  return { base, timeBonus, total: base + timeBonus };
}

export type QuestionStatus = "correct" | "incorrect" | "pass" | "timeout";

export type QuestionResult = {
  problem: Problem;
  status: QuestionStatus;
  /** Total score: base points + time bonus. Incorrect/pass/timeout answers score 0. */
  score: number;
  /** Base points. */
  base: number;
  /** Time bonus. */
  timeBonus: number;
  /** Remaining seconds when answered correctly. */
  remaining: number;
  /** Final input entered by the player. */
  finalInput: string;
};
