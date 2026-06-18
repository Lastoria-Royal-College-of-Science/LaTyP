import { describe, it, expect } from "vitest";
import katex from "katex";
import {
  PROBLEMS,
  getProblemPool,
  pickUnusedProblem,
  timeLimitFor,
} from "./problems";
import { katexMacros } from "../lib/katexMacros";
import { expandDerivatives } from "../lib/latexPreprocess";

describe("problem data", () => {
  it("has no duplicate IDs", () => {
    const ids = PROBLEMS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(PROBLEMS.map((p) => [p.id, p.label, p.latex]))(
    "%s (%s) renders with KaTeX",
    (_id, _label, latex) => {
      expect(() =>
        katex.renderToString(expandDerivatives(latex), {
          displayMode: true,
          macros: { ...katexMacros },
          throwOnError: true,
          strict: false,
        }),
      ).not.toThrow();
    },
  );

  it("keeps time limits in the 20-60 second range", () => {
    for (const p of PROBLEMS) {
      const t = timeLimitFor(p);
      expect(t).toBeGreaterThanOrEqual(20);
      expect(t).toBeLessThanOrEqual(60);
    }
  });
});

describe("pickUnusedProblem for free-pass swaps within 5 seconds", () => {
  it("does not choose an ID that has already appeared", () => {
    const used = new Set<string>();
    const pool = getProblemPool("highschool");
    // Mark all questions except one as used.
    pool.slice(1).forEach((p) => used.add(p.id));
    const picked = pickUnusedProblem("highschool", used);
    expect(picked).not.toBeNull();
    expect(picked!.id).toBe(pool[0].id);
    expect(used.has(picked!.id)).toBe(false);
  });

  it("returns null when no candidates remain", () => {
    const used = new Set(getProblemPool("highschool").map((p) => p.id));
    expect(pickUnusedProblem("highschool", used)).toBeNull();
  });

  it("chooses from all topics for the mixed pool", () => {
    const picked = pickUnusedProblem("mixed", new Set());
    expect(picked).not.toBeNull();
    expect(PROBLEMS.some((p) => p.id === picked!.id)).toBe(true);
  });
});
