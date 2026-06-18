/**
 * Preprocesses physics-package derivative macros \pdv / \dv into \frac form,
 * including optional order arguments.
 * KaTeX string macro definitions cannot handle optional arguments like [n], so this
 * runs before rendering in LatexRenderer and before canonicalization for checking.
 *
 * Supported forms:
 *   \pdv[2]{x}{t} -> \frac{\partial^{2} x}{\partial t^{2}}   (nth partial derivative)
 *   \pdv{f}{x}    -> \frac{\partial f}{\partial x}
 *   \pdv{x}       -> \frac{\partial}{\partial x}              (operator form)
 *   \dv[2]{x}{t}  -> \frac{\mathrm{d}^{2} x}{\mathrm{d} t^{2}}
 *   \dv{f}{x}     -> \frac{\mathrm{d} f}{\mathrm{d} x}
 *   \dv{x}        -> \frac{\mathrm{d}}{\mathrm{d} x}
 */

const DERIV_D: Record<string, string> = {
  "\\pdv": "\\partial",
  "\\dv": "\\mathrm{d}",
};

/** Reads from an opening bracket at s[i] through its matching closing bracket. */
function readGroup(
  s: string,
  i: number,
  open: string,
  close: string,
): { content: string; end: number } | null {
  if (s[i] !== open) return null;
  let depth = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === open) depth++;
    else if (s[j] === close) {
      depth--;
      if (depth === 0) return { content: s.slice(i + 1, j), end: j + 1 };
    }
  }
  return null;
}

function skipSpaces(s: string, i: number): number {
  while (i < s.length && /\s/.test(s[i])) i++;
  return i;
}

/** Finds cmd, excluding matches followed by a letter because those belong to another command. */
function findCommand(s: string, cmd: string): number {
  let from = 0;
  for (;;) {
    const idx = s.indexOf(cmd, from);
    if (idx < 0) return -1;
    const after = s[idx + cmd.length];
    if (after === undefined || !/[a-zA-Z]/.test(after)) return idx;
    from = idx + cmd.length;
  }
}

export function expandDerivatives(input: string): string {
  let s = input;
  let guard = 0;
  let changed = true;
  while (changed && guard++ < 50) {
    changed = false;
    for (const cmd of ["\\pdv", "\\dv"]) {
      const idx = findCommand(s, cmd);
      if (idx < 0) continue;

      let i = idx + cmd.length;
      i = skipSpaces(s, i);

      // Optional order [n].
      let order = "";
      if (s[i] === "[") {
        const g = readGroup(s, i, "[", "]");
        if (g) {
          order = g.content.trim();
          i = skipSpaces(s, g.end);
        }
      }

      // First argument {…}.
      if (s[i] !== "{") continue; // Leave unexpected forms untouched.
      const g1 = readGroup(s, i, "{", "}");
      if (!g1) continue;

      const d = DERIV_D[cmd];
      const j = skipSpaces(s, g1.end);
      let replacement: string;
      let end: number;

      if (s[j] === "{") {
        // Two-argument form, e.g. \pdv{f}{x}.
        const g2 = readGroup(s, j, "{", "}");
        if (!g2) continue;
        replacement = order
          ? `\\frac{${d}^{${order}} ${g1.content}}{${d} ${g2.content}^{${order}}}`
          : `\\frac{${d} ${g1.content}}{${d} ${g2.content}}`;
        end = g2.end;
      } else {
        // Operator form, e.g. \pdv{x}.
        replacement = order
          ? `\\frac{${d}^{${order}}}{${d} ${g1.content}^{${order}}}`
          : `\\frac{${d}}{${d} ${g1.content}}`;
        end = g1.end;
      }

      s = s.slice(0, idx) + replacement + s.slice(end);
      changed = true;
      break; // The string changed, so search again from the beginning.
    }
  }
  return s;
}
