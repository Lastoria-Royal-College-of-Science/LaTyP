import katex from "katex";
import { katexMacros } from "./katexMacros";
import { expandDerivatives } from "./latexPreprocess";

/**
 * Command synonym map. During normalization, each key is converted to its value.
 */
const SYNONYMS: Record<string, string> = {
  "\\to": "\\rightarrow",
  "\\gets": "\\leftarrow",
  "\\le": "\\leq",
  "\\ge": "\\geq",
  "\\ne": "\\neq",
  "\\neq": "\\neq",
  "\\dfrac": "\\frac",
  "\\tfrac": "\\frac",
  "\\cdotp": "\\cdot",
  "\\land": "\\wedge",
  "\\lor": "\\vee",
  "\\lnot": "\\neg",
  "\\owns": "\\ni",
  "\\bm": "\\boldsymbol",
  "\\curl": "\\rot",
  "\\infin": "\\infty",
  "\\implies": "\\Rightarrow",
  "\\impliedby": "\\Leftarrow",
};

/** Splits a LaTeX string into tokens; whitespace only separates tokens and is not emitted. */
export function tokenizeLatex(input: string): string[] {
  const tokens: string[] = [];
  const re = /\\[a-zA-Z]+|\\.|[^\s]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input)) !== null) {
    tokens.push(m[0]);
  }
  return tokens;
}

/** Recursively removes redundant braces such as `{` single-token `}`. */
function stripRedundantBraces(tokens: string[]): string[] {
  let changed = true;
  let current = tokens;
  while (changed) {
    changed = false;
    const next: string[] = [];
    for (let i = 0; i < current.length; i++) {
      if (
        current[i] === "{" &&
        i + 2 < current.length &&
        current[i + 2] === "}" &&
        current[i + 1] !== "{" &&
        current[i + 1] !== "}" &&
        // Single-token groups can be treated as equivalent when used as subscript/superscript targets.
        true
      ) {
        next.push(current[i + 1]);
        i += 2;
        changed = true;
      } else {
        next.push(current[i]);
      }
    }
    current = next;
  }
  return current;
}

/**
 * Normalizes notation differences.
 * - Ignores whitespace differences.
 * - Normalizes optional braces such as \frac12 and \frac{1}{2}.
 * - Normalizes command synonyms such as \to and \rightarrow.
 * - Normalizes macro synonyms such as \bm and \boldsymbol.
 */
export function normalizeLatex(input: string): string {
  let tokens = tokenizeLatex(input);
  // Normalize synonyms.
  tokens = tokens.map((t) => SYNONYMS[t] ?? t);
  // Remove redundant braces recursively, e.g. {x} -> x.
  tokens = stripRedundantBraces(tokens);
  // Rejoin tokens. Insert a space when a command is followed by a letter so \mathrm d does not become \mathrmd.
  let out = "";
  for (const t of tokens) {
    if (out !== "" && /\\[a-zA-Z]+$/.test(out) && /^[a-zA-Z]/.test(t)) {
      out += " " + t;
    } else {
      out += t;
    }
  }
  return out;
}

/**
 * Roman-insensitive normalization.
 * Allows roman type to be optional: \mathrm{d}x, dx, and \dd x are treated as equivalent.
 * Removes wrapping commands such as \mathrm / \text / \textrm / \rm and expands \dd to plain d
 * before applying normal normalization.
 */
export function normalizeLatexRomanInsensitive(input: string): string {
  let s = input;
  // \dd -> d; the roman differential d from the physics macro is treated like plain d.
  s = s.replace(/\\dd\b/g, "d");
  // Remove wrappers such as \mathrm{...}. Reapply because only shallow nesting is handled.
  const wrapRe = /\\(?:mathrm|textrm|text|rm)\s*\{([^{}]*)\}/g;
  let prev = "";
  while (prev !== s) {
    prev = s;
    s = s.replace(wrapRe, "$1");
  }
  // Forms like \mathrm d without braces apply to the next token; remove the command token.
  s = s.replace(/\\(?:mathrm|textrm|rm)\b/g, "");
  return normalizeLatex(s);
}

/**
 * Canonicalizes notation toward the same string when the meaning is equivalent.
 * latexEquals applies this to both input and target before rendering comparison, so visual
 * details such as delimiter size or delimiter spelling can still be treated as equivalent.
 *
 * Accepted variations:
 * - Spacing commands such as `\,` `\;` `\:` `\!` `\quad` `\qquad` `\ ` may be omitted.
 * - Automatic delimiter sizing with `\left` and `\right` is ignored.
 * - Absolute-value bars: `\lvert` `\rvert` `\vert` and `\abs{...}` normalize to `|...|`.
 * - Primes: `\prime`, `^{\prime}`, `^{\prime\prime}`, and `^'` normalize to `'`.
 * - Infix fractions such as `{A \over B}` normalize to `\frac{A}{B}`.
 * - Differential d: `\dd`, `\mathrm{d}`, `\mathrm d`, and plain `d` are equivalent.
 * - Empty braces such as `{}` in `{}_n` are removed.
 */
export function canonicalize(latex: string): string {
  // Expand physics derivative macros \pdv[n]{}{} / \dv into \frac form.
  let s = expandDerivatives(latex);

  // --- Remove spacing commands. ---
  s = s.replace(/\\[,;:!]/g, "");
  s = s.replace(/\\(?:quad|qquad)\b/g, "");
  s = s.replace(/\\ /g, "");

  // --- Ignore automatic delimiter sizing with \left and \right. ---
  //     Examples: \left\langle <-> \langle, \left| <-> |, \left( <-> (.
  s = s.replace(/\\left\b/g, "").replace(/\\right\b/g, "");

  // --- Infix fraction {A \over B} -> \frac{A}{B}. ---
  let prevOver = "";
  while (prevOver !== s) {
    prevOver = s;
    s = s.replace(/\{([^{}]*?)\\over\b([^{}]*?)\}/g, "\\frac{$1}{$2}");
  }

  // --- Normalize absolute-value delimiters to |. ---
  s = s.replace(/\\vert\b/g, "|");
  s = s.replace(/\\lvert\b/g, "|").replace(/\\rvert\b/g, "|");
  let prevAbs = "";
  while (prevAbs !== s) {
    prevAbs = s;
    s = s.replace(/\\abs\s*\{([^{}]*)\}/g, "|$1|");
  }

  // --- Normalize primes to ', including multiple primes and superscript notation. ---
  s = s.replace(/\\prime/g, "'");
  s = s.replace(/\^\s*\{\s*('+?)\s*\}/g, "$1"); // ^{''} -> ''
  s = s.replace(/\^\s*('+)/g, "$1"); //          ^'   -> '

  // --- Normalize differential d: \dd / \mathrm{d} / \mathrm d and plain d are equivalent. ---
  //     This only targets the character d, so \mathrm{C} for combinations is unaffected.
  s = s.replace(/\\dd\b/g, "d");
  s = s.replace(/\\mathrm\s*\{d\}/g, "d");
  s = s.replace(/\\mathrm\s+d/g, "d");

  // --- Remove empty braces {} so {}_n and _n are equivalent. ---
  s = s.replace(/\{\}(?=[_^])/g, "");

  return s;
}

/**
 * Macro set used for AST comparison. Unlike the display macros, these expand delimiters
 * without automatic sizing through \left and \right.
 * This makes forms like `\braket{\phi|\psi}` and manual `\langle\phi|\psi\rangle`,
 * or `\abs{x}` and `|x|`, produce the same AST.
 */
const comparisonMacros: Record<string, string> = {
  ...katexMacros,
  "\\abs": "|#1|",
  "\\norm": "\\|#1\\|",
  "\\bra": "\\langle #1|",
  "\\ket": "|#1\\rangle",
  "\\braket": "\\langle #1\\rangle",
  "\\ketbra": "|#1\\rangle\\langle #2|",
  "\\ev": "\\langle #1\\rangle",
  "\\comm": "[#1,#2]",
};

/**
 * Returns a canonical string key for the KaTeX parse tree (AST).
 * AST comparison handles variations that HTML-rendering comparison may miss:
 * - Optional braces, such as `\frac lg` vs. `\frac{l}{g}` and `\sqrt2` vs. `\sqrt{2}`.
 *   Single-element ordgroups are removed before comparison.
 * - Superscript/subscript order, such as `\sum^n_{k=1}` vs. `\sum_{k=1}^{n}`.
 *   The supsub node stores sub and sup as fields, so the order is irrelevant after key sorting.
 * canonicalize absorbs spacing, absolute values, primes, \dd, and infix fractions before parsing.
 * Returns null on failure.
 */
function astKey(latex: string): string | null {
  try {
    // katex.__parse is an internal API that returns an AST (ParseNode[]).
    const tree = (
      katex as unknown as {
        __parse: (e: string, o: object) => unknown;
      }
    ).__parse(canonicalize(latex), {
      macros: { ...comparisonMacros },
      throwOnError: true,
      strict: false,
    });
    return stableStringify(stripAst(tree));
  } catch {
    return null;
  }
}

/** Canonicalizes the AST by removing loc data and expanding single-element ordgroups. */
function stripAst(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(stripAst);
  if (node && typeof node === "object") {
    const n = node as Record<string, unknown>;
    // A single-element ordgroup is just redundant braces, so expand it and ignore brace presence.
    if (n.type === "ordgroup" && Array.isArray(n.body) && n.body.length === 1) {
      return stripAst(n.body[0]);
    }
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(n)) {
      if (k === "loc") continue; // Source positions are not semantically meaningful.
      out[k] = stripAst(n[k]);
    }
    return out;
  }
  return node;
}

/** Stable JSON stringification that is independent of object key order. */
function stableStringify(value: unknown): string {
  return JSON.stringify(value, (_key, val) => {
    if (val && typeof val === "object" && !Array.isArray(val)) {
      const sorted: Record<string, unknown> = {};
      for (const k of Object.keys(val as object).sort()) {
        sorted[k] = (val as Record<string, unknown>)[k];
      }
      return sorted;
    }
    return val;
  });
}

/** Returns KaTeX-rendered HTML, or null if rendering fails. */
function renderOrNull(latex: string): string | null {
  try {
    return katex.renderToString(latex, {
      displayMode: true,
      macros: { ...katexMacros },
      throwOnError: true,
      strict: false,
      trust: false,
      // MathML embeds the original LaTeX input, so only HTML output is used for semantic comparison.
      output: "html",
    });
  } catch {
    return null;
  }
}

/**
 * Checks whether two LaTeX strings produce semantically equivalent output.
 * 1. First compares canonicalized KaTeX ASTs.
 * 2. Falls back to raw rendering comparison.
 * 3. Then compares rendering after canonicalization.
 * 4. Finally compares normalized strings, including roman-insensitive normalization.
 */
export function latexEquals(input: string, target: string): boolean {
  const a = input.trim();
  const b = target.trim();
  if (!a) return false;
  if (a === b) return true;

  // 1) AST comparison is the primary check.
  //    Absorbs omitted braces, super/subscript ordering, spaces, \dd/d, absolute values, primes, and infix fractions.
  const ka = astKey(a);
  const kb = astKey(b);
  if (ka !== null && kb !== null && ka === kb) return true;

  // 2) Raw rendering comparison, used as a fallback for syntax that cannot be parsed into an AST.
  const ra = renderOrNull(a);
  const rb = renderOrNull(b);
  if (ra !== null && rb !== null && ra === rb) return true;

  // 3) Rendering comparison after canonicalization.
  const ca = canonicalize(a);
  const cb = canonicalize(b);
  const rca = renderOrNull(ca);
  const rcb = renderOrNull(cb);
  if (rca !== null && rcb !== null && rca === rcb) return true;

  // 4) String normalization fallback when rendering fails.
  if (normalizeLatex(a) === normalizeLatex(b)) return true;
  if (normalizeLatex(ca) === normalizeLatex(cb)) return true;
  // 5) Also ignore roman-type differences such as \mathrm{d}x vs. dx.
  return (
    normalizeLatexRomanInsensitive(a) === normalizeLatexRomanInsensitive(b)
  );
}
