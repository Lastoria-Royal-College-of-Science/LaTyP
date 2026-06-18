import { useCallback, useEffect, useRef, useState } from "react";
import {
  DIFFICULTY_INFO,
  pickUnusedProblem,
  timeLimitFor,
  type Difficulty,
  type Problem,
} from "../data/problems";
import { latexEquals } from "../lib/normalizeLatex";
import {
  scoreBreakdownFor,
  type QuestionResult,
  type ScoreBreakdown,
} from "../lib/score";
import LatexRenderer from "./LatexRenderer";

type Props = {
  difficulty: Difficulty;
  problems: Problem[];
  onFinish: (results: QuestionResult[]) => void;
};

type Feedback = "correct" | "wrong" | "pass" | "timeout" | null;

const TICK_MS = 100;
/** Passing within this many seconds swaps in another question without counting it. */
const FREE_PASS_SECONDS = 5;

export default function GameScreen({
  difficulty,
  problems: initialProblems,
  onFinish,
}: Props) {
  const [problems, setProblems] = useState<Problem[]>(initialProblems);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(() =>
    timeLimitFor(initialProblems[0]),
  );
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [lastGain, setLastGain] = useState<ScoreBreakdown | null>(null);
  const [swapNotice, setSwapNotice] = useState(false);

  const resultsRef = useRef<QuestionResult[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const transitioningRef = useRef(false);
  // Question IDs that have already appeared; used to avoid duplicates during swaps.
  const seenIdsRef = useRef<Set<string>>(
    new Set(initialProblems.map((p) => p.id)),
  );

  const problem = problems[index];
  const timeLimit = timeLimitFor(problem);
  const info = DIFFICULTY_INFO[difficulty];
  // Whether the current question is still within the free-pass window.
  const inFreeWindow = timeLimit - timeLeft <= FREE_PASS_SECONDS;

  const goNext = useCallback(
    (result: QuestionResult) => {
      if (transitioningRef.current) return;
      transitioningRef.current = true;
      resultsRef.current = [...resultsRef.current, result];
      setFeedback(
        result.status === "correct"
          ? "correct"
          : result.status === "pass"
            ? "pass"
            : "timeout",
      );
      if (result.status === "correct") {
        setTotalScore((s) => s + result.score);
        setLastGain({
          base: result.base,
          timeBonus: result.timeBonus,
          total: result.score,
        });
      }
      window.setTimeout(() => {
        if (index + 1 >= problems.length) {
          onFinish(resultsRef.current);
          return;
        }
        setIndex(index + 1);
        setInput("");
        setWrongAttempts(0);
        setTimeLeft(timeLimitFor(problems[index + 1]));
        setFeedback(null);
        transitioningRef.current = false;
        inputRef.current?.focus();
      }, result.status === "correct" ? 900 : 700);
    },
    [index, problems, onFinish],
  );

  // Timer
  useEffect(() => {
    const id = window.setInterval(() => {
      if (transitioningRef.current) return;
      setTimeLeft((t) => {
        const next = Math.max(0, t - TICK_MS / 1000);
        return next;
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [index]);

  // Timeout handling
  useEffect(() => {
    if (timeLeft > 0 || transitioningRef.current) return;
    goNext({
      problem,
      status: wrongAttempts > 0 || input.trim() ? "incorrect" : "timeout",
      score: 0,
      base: 0,
      timeBonus: 0,
      remaining: 0,
      finalInput: input,
    });
  }, [timeLeft, goNext, problem, wrongAttempts, input]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = () => {
    if (transitioningRef.current) return;
    if (latexEquals(input, problem.latex)) {
      const breakdown = scoreBreakdownFor(problem, Math.floor(timeLeft));
      goNext({
        problem,
        status: "correct",
        score: breakdown.total,
        base: breakdown.base,
        timeBonus: breakdown.timeBonus,
        remaining: Math.floor(timeLeft),
        finalInput: input,
      });
    } else {
      setWrongAttempts((n) => n + 1);
      setFeedback("wrong");
      window.setTimeout(() => {
        setFeedback((f) => (f === "wrong" ? null : f));
      }, 500);
    }
  };

  /** Free pass within 5 seconds: swap in an unused question. Returns true if swapped. */
  const trySwapProblem = () => {
    const next = pickUnusedProblem(difficulty, seenIdsRef.current);
    if (!next) return false; // Fall back to a normal pass when no replacement remains.
    seenIdsRef.current.add(next.id);
    setProblems((prev) => {
      const copy = [...prev];
      copy[index] = next;
      return copy;
    });
    setInput("");
    setWrongAttempts(0);
    setTimeLeft(timeLimitFor(next));
    setFeedback(null);
    setSwapNotice(true);
    window.setTimeout(() => setSwapNotice(false), 1400);
    inputRef.current?.focus();
    return true;
  };

  const pass = () => {
    if (transitioningRef.current) return;
    // Within the first 5 seconds, provide another question without marking this one wrong.
    if (inFreeWindow && trySwapProblem()) return;
    goNext({
      problem,
      status: "pass",
      score: 0,
      base: 0,
      timeBonus: 0,
      remaining: Math.floor(timeLeft),
      finalInput: input,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      pass();
    }
  };

  const timeRatio = timeLeft / timeLimit;
  const timerColor =
    timeRatio > 0.5
      ? "bg-emerald-500"
      : timeRatio > 0.25
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      {/* Header */}
      <div className="w-full max-w-3xl flex items-center justify-between text-sm text-gray-500">
        <span className="font-semibold">
          {info.name} Question {index + 1} / {problems.length}
        </span>
        <span className="text-lg font-bold text-gray-800 tabular-nums">
          SCORE {totalScore.toLocaleString()}
          {lastGain && feedback === "correct" && (
            <span className="ml-2 text-emerald-500 animate-score-pop inline-block">
              +{lastGain.total.toLocaleString()}
              <span className="ml-1 text-xs font-semibold text-emerald-400">
                (base {lastGain.base} + time {lastGain.timeBonus})
              </span>
            </span>
          )}
        </span>
      </div>

      {/* Timer bar */}
      <div className="w-full max-w-3xl mt-3">
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${timerColor} rounded-full transition-[width] duration-100 ease-linear`}
            style={{ width: `${timeRatio * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1 text-xs tabular-nums">
          <span
            className={`font-semibold text-sky-600 transition-opacity ${
              swapNotice ? "opacity-100" : "opacity-0"
            }`}
          >
            Swapped to another question without counting this one.
          </span>
          <span className="text-gray-400">{Math.ceil(timeLeft)} seconds left</span>
        </div>
      </div>

      {/* Target formula */}
      <div
        className={`relative w-full max-w-3xl mt-4 bg-white rounded-2xl border-2 shadow-sm p-8 flex flex-col items-center justify-center min-h-36 transition-colors ${
          feedback === "correct"
            ? "border-emerald-400 animate-correct-flash"
            : "border-gray-200"
        }`}
      >
        <span className="absolute top-3 left-4 text-xs font-semibold text-gray-400">
          Target
        </span>
        <LatexRenderer latex={problem.latex} className="text-xl text-gray-800" />
        {feedback === "correct" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-5xl font-black text-emerald-500/90 animate-stamp">
              Correct!
            </span>
          </div>
        )}
        {(feedback === "pass" || feedback === "timeout") && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-white/70 rounded-2xl">
            <span className="text-4xl font-black text-gray-400 animate-stamp">
              {feedback === "pass" ? "PASS" : "TIME UP"}
            </span>
          </div>
        )}
      </div>

      {/* Input preview */}
      <div className="w-full max-w-3xl mt-4 bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-6 flex flex-col items-center justify-center min-h-28 relative">
        <span className="absolute top-3 left-4 text-xs font-semibold text-gray-400">
          Your input
        </span>
        <LatexRenderer
          latex={input}
          className="text-xl text-blue-700"
          fallback="Your rendered input will appear here in real time."
        />
      </div>

      {/* Input form */}
      <div
        className={`w-full max-w-3xl mt-4 ${feedback === "wrong" ? "animate-shake" : ""}`}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          spellCheck={false}
          placeholder="Enter LaTeX (example: \frac{1}{2}) — press Enter to submit"
          className="w-full font-mono text-lg bg-white border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-3 resize-none shadow-sm"
        />
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={pass}
            title={
              inFreeWindow
                ? "Within the first 5 seconds: swap to another question without counting this one"
                : "Skip this question for 0 points"
            }
            className={`px-5 py-2.5 rounded-xl border-2 font-semibold transition-colors cursor-pointer ${
              inFreeWindow
                ? "border-sky-300 text-sky-600 hover:bg-sky-50"
                : "border-gray-300 text-gray-500 hover:bg-gray-100"
            }`}
          >
            {inFreeWindow ? "Another question (Esc, no count)" : "Pass (Esc)"}
          </button>
          {feedback === "wrong" && (
            <span className="text-red-500 font-semibold text-sm">
              Not a match yet...
            </span>
          )}
          <button
            onClick={submit}
            className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow cursor-pointer"
          >
            Check (Enter)
          </button>
        </div>
      </div>
    </div>
  );
}
