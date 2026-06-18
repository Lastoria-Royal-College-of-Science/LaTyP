export type Difficulty = "highschool" | "university" | "mixed";

export type Problem = {
  id: string;
  difficulty: Difficulty;
  /** Model LaTeX code. */
  latex: string;
  /** Formula name or description shown on the review screen. */
  label: string;
};

export const DIFFICULTY_INFO: Record<
  Difficulty,
  { name: string; multiplier: number; description: string; accent: string }
> = {
  highschool: {
    name: "High School",
    multiplier: 1.0,
    description: "Core formulas from calculus, vectors, trigonometry, and mechanics",
    accent: "emerald",
  },
  university: {
    name: "University",
    multiplier: 1.5,
    description: "Linear algebra, analysis, electromagnetism, and quantum mechanics",
    accent: "blue",
  },
  mixed: {
    name: "Mixed",
    multiplier: 2.0,
    description: "All topics mixed with advanced mathematical physics",
    accent: "purple",
  },
};

export const PROBLEMS: Problem[] = [
  // ===== High school level: mathematics =====
  { id: "h1", difficulty: "highschool", latex: "\\int x^2 \\, dx = \\frac{x^3}{3} + C", label: "Indefinite integral" },
  { id: "h2", difficulty: "highschool", latex: "\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta", label: "Vector dot product" },
  { id: "h3", difficulty: "highschool", latex: "\\sin^2\\theta + \\cos^2\\theta = 1", label: "Fundamental trigonometric identity" },
  { id: "h4", difficulty: "highschool", latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}", label: "Quadratic formula" },
  { id: "h5", difficulty: "highschool", latex: "\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}", label: "Sum of natural numbers" },
  { id: "h6", difficulty: "highschool", latex: "\\sum_{k=1}^{n} k^2 = \\frac{n(n+1)(2n+1)}{6}", label: "Sum of squares" },
  { id: "h7", difficulty: "highschool", latex: "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1", label: "Trigonometric limit" },
  { id: "h8", difficulty: "highschool", latex: "a^2 = b^2 + c^2 - 2bc\\cos A", label: "Law of cosines" },
  { id: "h9", difficulty: "highschool", latex: "\\frac{a}{\\sin A} = 2R", label: "Law of sines" },
  { id: "h10", difficulty: "highschool", latex: "\\frac{d}{dx} \\sin x = \\cos x", label: "Derivative of sine" },
  { id: "h11", difficulty: "highschool", latex: "\\frac{d}{dx} e^x = e^x", label: "Derivative of the exponential function" },
  { id: "h12", difficulty: "highschool", latex: "\\log_a MN = \\log_a M + \\log_a N", label: "Logarithm property" },
  { id: "h13", difficulty: "highschool", latex: "\\sin(\\alpha + \\beta) = \\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta", label: "Angle addition formula" },
  { id: "h14", difficulty: "highschool", latex: "\\cos 2\\theta = 1 - 2\\sin^2\\theta", label: "Double-angle formula" },
  { id: "h15", difficulty: "highschool", latex: "\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}", label: "Definition of tangent" },
  { id: "h16", difficulty: "highschool", latex: "S = \\frac{1}{2}ab\\sin C", label: "Area of a triangle" },
  { id: "h17", difficulty: "highschool", latex: "(a+b)^2 = a^2 + 2ab + b^2", label: "Expansion formula" },
  { id: "h18", difficulty: "highschool", latex: "y = a(x-p)^2 + q", label: "Vertex form of a quadratic function" },
  { id: "h19", difficulty: "highschool", latex: "\\sqrt{a^2} = |a|", label: "Radicals and absolute value" },
  { id: "h20", difficulty: "highschool", latex: "{}_n \\mathrm{C}_r = \\frac{n!}{r!(n-r)!}", label: "Combinations" },

  // ===== High school level: physics =====
  { id: "h21", difficulty: "highschool", latex: "v = v_0 + at", label: "Velocity under constant acceleration" },
  { id: "h22", difficulty: "highschool", latex: "x = v_0 t + \\frac{1}{2}at^2", label: "Displacement under constant acceleration" },
  { id: "h23", difficulty: "highschool", latex: "v^2 - v_0^2 = 2ax", label: "Constant-acceleration motion without time" },
  { id: "h24", difficulty: "highschool", latex: "F = ma", label: "Equation of motion" },
  { id: "h25", difficulty: "highschool", latex: "E = \\frac{1}{2}mv^2", label: "Kinetic energy" },
  { id: "h26", difficulty: "highschool", latex: "F = G\\frac{Mm}{r^2}", label: "Law of universal gravitation" },
  { id: "h27", difficulty: "highschool", latex: "V = RI", label: "Ohm's law" },
  { id: "h28", difficulty: "highschool", latex: "Q = mc\\Delta T", label: "Heat quantity formula" },
  { id: "h29", difficulty: "highschool", latex: "v = f\\lambda", label: "Basic wave equation" },
  { id: "h30", difficulty: "highschool", latex: "p = mv", label: "Momentum" },
  { id: "h31", difficulty: "highschool", latex: "W = Fx\\cos\\theta", label: "Definition of work" },
  { id: "h32", difficulty: "highschool", latex: "T = 2\\pi\\sqrt{\\frac{l}{g}}", label: "Period of a simple pendulum" },

  // ===== High school level: additional mathematics =====
  { id: "h33", difficulty: "highschool", latex: "\\int_a^b f(x) \\, dx = F(b) - F(a)", label: "Fundamental theorem of calculus" },
  { id: "h34", difficulty: "highschool", latex: "\\frac{d}{dx} x^n = nx^{n-1}", label: "Derivative of a power function" },
  { id: "h35", difficulty: "highschool", latex: "\\log_a b = \\frac{\\log_c b}{\\log_c a}", label: "Change-of-base formula" },
  { id: "h36", difficulty: "highschool", latex: "a_n = a_1 + (n-1)d", label: "General term of an arithmetic sequence" },
  { id: "h37", difficulty: "highschool", latex: "S_n = \\frac{a(r^n - 1)}{r - 1}", label: "Sum of a geometric sequence" },
  { id: "h38", difficulty: "highschool", latex: "\\sum_{k=1}^{n} k^3 = \\left\\{ \\frac{n(n+1)}{2} \\right\\}^2", label: "Sum of cubes" },
  { id: "h39", difficulty: "highschool", latex: "\\vec{a} \\cdot \\vec{b} = a_1 b_1 + a_2 b_2", label: "Component form of the dot product" },
  { id: "h40", difficulty: "highschool", latex: "\\sin\\theta = \\cos\\left( \\frac{\\pi}{2} - \\theta \\right)", label: "Cofunction identity" },
  { id: "h41", difficulty: "highschool", latex: "\\frac{d}{dx} \\log x = \\frac{1}{x}", label: "Derivative of the logarithm" },

  // ===== High school level: additional physics =====
  { id: "h42", difficulty: "highschool", latex: "a = \\frac{v^2}{r}", label: "Centripetal acceleration" },
  { id: "h43", difficulty: "highschool", latex: "F = k\\frac{q_1 q_2}{r^2}", label: "Coulomb's law" },
  { id: "h44", difficulty: "highschool", latex: "P = IV", label: "Electric power" },
  { id: "h45", difficulty: "highschool", latex: "E = h\\nu", label: "Photon energy" },
  { id: "h46", difficulty: "highschool", latex: "U = mgh", label: "Gravitational potential energy" },
  { id: "h47", difficulty: "highschool", latex: "x = A\\sin\\omega t", label: "Displacement in simple harmonic motion" },
  { id: "h48", difficulty: "highschool", latex: "m_1 v_1 + m_2 v_2 = m_1 v_1' + m_2 v_2'", label: "Conservation of momentum" },

  // ===== University level: electromagnetism =====
  { id: "u1", difficulty: "university", latex: "\\rot \\bm{E} = -\\frac{\\partial \\bm{B}}{\\partial t}", label: "Faraday's law (Maxwell equation)" },
  { id: "u2", difficulty: "university", latex: "\\div \\bm{B} = 0", label: "Gauss's law for magnetism" },
  { id: "u3", difficulty: "university", latex: "\\div \\bm{E} = \\frac{\\rho}{\\varepsilon_0}", label: "Gauss's law" },
  { id: "u4", difficulty: "university", latex: "\\bm{F} = q(\\bm{E} + \\bm{v} \\times \\bm{B})", label: "Lorentz force" },
  { id: "u5", difficulty: "university", latex: "\\oint_C \\bm{B} \\cdot \\dd\\bm{l} = \\mu_0 I", label: "Ampere's law" },
  { id: "u6", difficulty: "university", latex: "\\nabla^2 \\phi = -\\frac{\\rho}{\\varepsilon_0}", label: "Poisson equation for electrostatics" },

  // ===== University level: quantum mechanics =====
  { id: "u7", difficulty: "university", latex: "\\hat{H}\\psi = E\\psi", label: "Time-independent Schrodinger equation" },
  { id: "u8", difficulty: "university", latex: "i\\hbar \\frac{\\partial}{\\partial t} \\ket{\\psi} = \\hat{H} \\ket{\\psi}", label: "Schrodinger equation" },
  { id: "u9", difficulty: "university", latex: "\\braket{\\phi|\\psi}", label: "Inner product in bra-ket notation" },
  { id: "u10", difficulty: "university", latex: "\\braket{\\psi|\\psi} = 1", label: "Normalization condition" },
  { id: "u11", difficulty: "university", latex: "[\\hat{x}, \\hat{p}] = i\\hbar", label: "Canonical commutation relation" },
  { id: "u12", difficulty: "university", latex: "\\hat{p} = -i\\hbar\\frac{\\partial}{\\partial x}", label: "Momentum operator" },
  { id: "u13", difficulty: "university", latex: "E = \\hbar\\omega", label: "Photon energy" },

  // ===== University level: linear algebra =====
  { id: "u14", difficulty: "university", latex: "A\\bm{x} = \\lambda\\bm{x}", label: "Eigenvalue equation" },
  { id: "u15", difficulty: "university", latex: "\\det(A - \\lambda I) = 0", label: "Characteristic equation" },
  { id: "u16", difficulty: "university", latex: "(AB)^{-1} = B^{-1}A^{-1}", label: "Inverse matrix property" },
  { id: "u17", difficulty: "university", latex: "\\mathrm{tr}(AB) = \\mathrm{tr}(BA)", label: "Cyclic property of the trace" },
  { id: "u18", difficulty: "university", latex: "\\|\\bm{x} + \\bm{y}\\| \\leq \\|\\bm{x}\\| + \\|\\bm{y}\\|", label: "Triangle inequality" },

  // ===== University level: analysis =====
  { id: "u19", difficulty: "university", latex: "\\int_{-\\infty}^{\\infty} e^{-x^2} \\, \\dd x = \\sqrt{\\pi}", label: "Gaussian integral" },
  { id: "u20", difficulty: "university", latex: "\\int_0^\\infty \\frac{\\sin x}{x} \\, \\dd x = \\frac{\\pi}{2}", label: "Dirichlet integral" },
  { id: "u21", difficulty: "university", latex: "\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\nabla^2 u", label: "Wave equation" },
  { id: "u22", difficulty: "university", latex: "e^{i\\pi} + 1 = 0", label: "Euler's identity" },
  { id: "u23", difficulty: "university", latex: "e^{i\\theta} = \\cos\\theta + i\\sin\\theta", label: "Euler's formula" },
  { id: "u24", difficulty: "university", latex: "\\Gamma(n+1) = n!", label: "Gamma function and factorial" },
  { id: "u25", difficulty: "university", latex: "\\frac{\\dd^2 x}{\\dd t^2} + \\omega^2 x = 0", label: "Equation of simple harmonic motion" },
  { id: "u26", difficulty: "university", latex: "\\dv{x}{t} = v", label: "Definition of velocity as a derivative" },
  { id: "u47", difficulty: "university", latex: "\\pdv[2]{u}{t} = c^2 \\pdv[2]{u}{x}", label: "One-dimensional wave equation in partial-derivative notation" },

  // ===== University level: mathematical physics =====
  { id: "u27", difficulty: "university", latex: "\\hat{f}(k) = \\int_{-\\infty}^{\\infty} f(x) e^{-ikx} \\, \\dd x", label: "Fourier transform" },
  { id: "u28", difficulty: "university", latex: "f(x) = \\frac{1}{2\\pi} \\int_{-\\infty}^{\\infty} \\hat{f}(k) e^{ikx} \\, \\dd k", label: "Inverse Fourier transform" },
  { id: "u29", difficulty: "university", latex: "f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} (a_n \\cos nx + b_n \\sin nx)", label: "Fourier series" },
  { id: "u30", difficulty: "university", latex: "f(z) = \\sum_{n=-\\infty}^{\\infty} a_n (z - z_0)^n", label: "Laurent series" },
  { id: "u31", difficulty: "university", latex: "\\oint_C f(z) \\, \\dd z = 2\\pi i \\sum_k \\mathrm{Res}(f, z_k)", label: "Residue theorem" },
  { id: "u32", difficulty: "university", latex: "f(a) = \\frac{1}{2\\pi i} \\oint_C \\frac{f(z)}{z - a} \\, \\dd z", label: "Cauchy integral formula" },
  { id: "u33", difficulty: "university", latex: "\\Gamma(z) = \\int_0^\\infty t^{z-1} e^{-t} \\, \\dd t", label: "Definition of the gamma function" },
  { id: "u34", difficulty: "university", latex: "P_n(x) = \\frac{1}{2^n n!} \\frac{\\dd^n}{\\dd x^n} (x^2 - 1)^n", label: "Rodrigues' formula for Legendre polynomials" },
  { id: "u35", difficulty: "university", latex: "x^2 y'' + x y' + (x^2 - n^2) y = 0", label: "Bessel differential equation" },
  { id: "u36", difficulty: "university", latex: "\\int_{-\\infty}^{\\infty} \\delta(x) f(x) \\, \\dd x = f(0)", label: "Property of the delta function" },
  { id: "u37", difficulty: "university", latex: "\\ln n! \\approx n \\ln n - n", label: "Stirling approximation" },

  // ===== University level: applied physics =====
  { id: "u38", difficulty: "university", latex: "Z_1 = V \\left( \\frac{2\\pi m k_B T}{h^2} \\right)^{3/2}", label: "Single-particle partition function for an ideal gas" },
  { id: "u39", difficulty: "university", latex: "\\gamma_n = i \\oint \\braket{n(\\bm{R}) | \\nabla_{\\bm{R}} | n(\\bm{R})} \\cdot \\dd\\bm{R}", label: "Berry phase" },
  { id: "u40", difficulty: "university", latex: "\\bm{\\Omega}_n = \\nabla_{\\bm{R}} \\times \\bm{A}_n(\\bm{R})", label: "Berry curvature" },
  { id: "u41", difficulty: "university", latex: "ds^2 = -\\left(1 - \\frac{r_s}{r}\\right) c^2 dt^2 + \\left(1 - \\frac{r_s}{r}\\right)^{-1} dr^2 + r^2 d\\Omega^2", label: "Schwarzschild metric" },
  { id: "u42", difficulty: "university", latex: "Z = \\mathrm{tr}(T^N)", label: "Partition function via the transfer matrix method" },
  { id: "u43", difficulty: "university", latex: "f(E) = \\frac{1}{e^{(E - \\mu)/k_B T} + 1}", label: "Fermi-Dirac distribution" },
  { id: "u44", difficulty: "university", latex: "n(E) = \\frac{1}{e^{(E - \\mu)/k_B T} - 1}", label: "Bose-Einstein distribution" },
  { id: "u45", difficulty: "university", latex: "E_n^{(1)} = \\braket{n^{(0)} | \\hat{H}' | n^{(0)}}", label: "First-order perturbation energy" },

  // ===== Mixed level: advanced mathematical physics =====
  { id: "m1", difficulty: "mixed", latex: "\\oint_C \\bm{E} \\cdot \\dd\\bm{l} = -\\frac{\\dd\\Phi}{\\dd t}", label: "Law of electromagnetic induction in integral form" },
  { id: "m2", difficulty: "mixed", latex: "R_{\\mu\\nu} - \\frac{1}{2}g_{\\mu\\nu}R = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}", label: "Einstein field equation" },
  { id: "m3", difficulty: "mixed", latex: "\\mathcal{L} = \\frac{1}{2}m\\dot{q}^2 - V(q)", label: "Lagrangian" },
  { id: "m4", difficulty: "mixed", latex: "Z = \\sum_n e^{-\\beta E_n}", label: "Partition function" },
  { id: "m5", difficulty: "mixed", latex: "\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s}", label: "Riemann zeta function" },
  { id: "m6", difficulty: "mixed", latex: "\\bra{\\psi}\\hat{A}\\ket{\\psi}", label: "Expectation value in bra-ket notation" },
  { id: "m7", difficulty: "mixed", latex: "\\Delta x \\, \\Delta p \\geq \\frac{\\hbar}{2}", label: "Uncertainty principle" },
  { id: "m8", difficulty: "mixed", latex: "f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(0)}{n!}x^n", label: "Maclaurin expansion" },
  { id: "m9", difficulty: "mixed", latex: "\\nabla^2 \\phi = 4\\pi G \\rho", label: "Poisson equation for the gravitational field" },
  { id: "m10", difficulty: "mixed", latex: "\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n = e", label: "Definition of Euler's number" },
  { id: "m11", difficulty: "mixed", latex: "S = k_B \\ln W", label: "Boltzmann formula" },
  { id: "m12", difficulty: "mixed", latex: "PV = nRT", label: "Ideal gas equation of state" },
  { id: "m13", difficulty: "mixed", latex: "E = mc^2", label: "Mass-energy equivalence" },
  { id: "m14", difficulty: "mixed", latex: "\\lambda = \\frac{h}{p}", label: "de Broglie wavelength" },
  { id: "m15", difficulty: "mixed", latex: "\\cosh^2 x - \\sinh^2 x = 1", label: "Fundamental hyperbolic-function identity" },
  { id: "m16", difficulty: "mixed", latex: "\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}", label: "Basel problem" },
  { id: "m17", difficulty: "mixed", latex: "\\nabla \\times (\\nabla \\times \\bm{A}) = \\nabla(\\nabla \\cdot \\bm{A}) - \\nabla^2 \\bm{A}", label: "Vector calculus identity" },
  { id: "m18", difficulty: "mixed", latex: "\\mathcal{F}[f](k) = \\int_{-\\infty}^{\\infty} f(x) e^{-ikx} \\, \\dd x", label: "Fourier transform" },
];

/** Question pool for the selected difficulty; mixed draws from all topics. */
export function getProblemPool(difficulty: Difficulty): Problem[] {
  if (difficulty === "mixed") return [...PROBLEMS];
  return PROBLEMS.filter((p) => p.difficulty === difficulty);
}

/** Randomly selects n questions from the pool, shuffled and without duplicates. */
export function pickProblems(difficulty: Difficulty, n: number): Problem[] {
  const pool = getProblemPool(difficulty);
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

/**
 * Randomly selects one unused question from the pool.
 * Used when swapping questions after a pass within the first 5 seconds.
 * Returns null when no candidates remain.
 */
export function pickUnusedProblem(
  difficulty: Difficulty,
  usedIds: ReadonlySet<string>,
): Problem | null {
  const candidates = getProblemPool(difficulty).filter(
    (p) => !usedIds.has(p.id),
  );
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/** Time limit based on formula length, clamped to 20-60 seconds. */
export function timeLimitFor(problem: Problem): number {
  const len = problem.latex.replace(/\s+/g, "").length;
  return Math.min(60, Math.max(20, Math.round(len * 1.2)));
}
