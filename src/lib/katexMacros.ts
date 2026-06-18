/**
 * KaTeX custom macro definitions.
 * Supports commands equivalent to the physics / bm / braket packages.
 * The same macro set is used for answer checking, which compares rendered output,
 * so expansions such as "\bm{v}" and "\boldsymbol{v}" are treated as equivalent.
 */
export const katexMacros: Record<string, string> = {
  // ===== physics-package equivalents =====
  // Differential d; both \dd x and \dd{x} are supported.
  "\\dd": "\\mathrm{d}",
  // Shorthand for the partial derivative symbol.
  "\\pd": "\\partial",
  // Ordinary and partial derivatives with two arguments.
  "\\dv": "\\frac{\\mathrm{d}#1}{\\mathrm{d}#2}",
  "\\pdv": "\\frac{\\partial #1}{\\partial #2}",
  // Vector calculus.
  "\\grad": "\\nabla",
  "\\div": "\\nabla\\cdot",
  "\\rot": "\\nabla\\times",
  "\\curl": "\\nabla\\times",
  "\\laplacian": "\\nabla^2",
  // Other physics-style helpers.
  "\\abs": "\\left|#1\\right|",
  "\\norm": "\\left\\|#1\\right\\|",
  "\\ev": "\\left\\langle #1 \\right\\rangle",
  "\\comm": "\\left[#1, #2\\right]",
  "\\order": "\\mathcal{O}\\left(#1\\right)",
  "\\vb": "\\mathbf{#1}",

  // ===== bm-package equivalent =====
  "\\bm": "\\boldsymbol{#1}",

  // ===== braket package =====
  // KaTeX supports \bra, \ket, and \braket natively, but defining them as macros
  // smooths over version differences.
  "\\bra": "\\left\\langle #1 \\right|",
  "\\ket": "\\left| #1 \\right\\rangle",
  "\\braket": "\\left\\langle #1 \\right\\rangle",
  "\\ketbra": "\\left| #1 \\middle\\rangle\\!\\middle\\langle #2 \\right|",
};
