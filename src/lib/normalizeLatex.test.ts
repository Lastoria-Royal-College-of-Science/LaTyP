import { describe, it, expect } from "vitest";
import { normalizeLatex, latexEquals, tokenizeLatex } from "./normalizeLatex";

describe("tokenizeLatex", () => {
  it("splits commands, symbols, and characters", () => {
    expect(tokenizeLatex("\\frac{1}{2}")).toEqual([
      "\\frac",
      "{",
      "1",
      "}",
      "{",
      "2",
      "}",
    ]);
  });
  it("ignores whitespace", () => {
    expect(tokenizeLatex("x + y")).toEqual(["x", "+", "y"]);
  });
});

describe("normalizeLatex: whitespace variations", () => {
  it("ignores spaces", () => {
    expect(normalizeLatex("\\int x dx")).toBe(normalizeLatex("\\int xdx"));
  });
  it("keeps command boundaries so \\mathrm d is not broken", () => {
    expect(normalizeLatex("\\mathrm d x")).not.toContain("\\mathrmd");
  });
});

describe("normalizeLatex: optional braces", () => {
  it("treats \\frac12 and \\frac{1}{2} as equivalent", () => {
    expect(normalizeLatex("\\frac{1}{2}")).toBe(normalizeLatex("\\frac12"));
  });
  it("treats \\sqrt2 and \\sqrt{2} as equivalent", () => {
    expect(normalizeLatex("\\sqrt{2}")).toBe(normalizeLatex("\\sqrt2"));
  });
  it("also removes nested redundant braces such as {{x}}", () => {
    expect(normalizeLatex("{{x}}")).toBe("x");
  });
  it("keeps braces around multiple tokens", () => {
    expect(normalizeLatex("\\frac{a+b}{2}")).not.toBe(
      normalizeLatex("\\frac a+b2"),
    );
  });
});

describe("normalizeLatex: command synonyms", () => {
  it("treats \\to and \\rightarrow as equivalent", () => {
    expect(normalizeLatex("x \\to 0")).toBe(normalizeLatex("x \\rightarrow 0"));
  });
  it("treats \\le and \\leq as equivalent", () => {
    expect(normalizeLatex("a \\le b")).toBe(normalizeLatex("a \\leq b"));
  });
  it("treats \\dfrac and \\frac as equivalent", () => {
    expect(normalizeLatex("\\dfrac{1}{2}")).toBe(normalizeLatex("\\frac{1}{2}"));
  });
});

describe("latexEquals: semantic matching through rendering", () => {
  it("absorbs whitespace variations", () => {
    expect(latexEquals("\\int x^2 \\, dx", "\\int x^2 \\,dx")).toBe(true);
  });
  it("matches \\frac12 and \\frac{1}{2}", () => {
    expect(latexEquals("\\frac12", "\\frac{1}{2}")).toBe(true);
  });
  it("treats \\bm{v} and \\boldsymbol{v} as equivalent through macro expansion", () => {
    expect(latexEquals("\\bm{v}", "\\boldsymbol{v}")).toBe(true);
  });
  it("treats \\to and \\rightarrow as equivalent", () => {
    expect(latexEquals("x \\to \\infty", "x \\rightarrow \\infty")).toBe(true);
  });
  it("treats \\grad and \\nabla as equivalent through the physics macro", () => {
    expect(latexEquals("\\grad f", "\\nabla f")).toBe(true);
  });
  it("treats \\rot and \\nabla\\times as equivalent", () => {
    expect(latexEquals("\\rot \\bm{E}", "\\nabla\\times\\boldsymbol{E}")).toBe(
      true,
    );
  });
  it("treats \\dd x and \\mathrm{d}x as equivalent", () => {
    expect(latexEquals("\\dd x", "\\mathrm{d}x")).toBe(true);
  });
  it("rejects different formulas", () => {
    expect(latexEquals("x^2", "x^3")).toBe(false);
    expect(latexEquals("\\frac{1}{2}", "\\frac{1}{3}")).toBe(false);
  });
  it("rejects empty input", () => {
    expect(latexEquals("", "x")).toBe(false);
    expect(latexEquals("   ", "x")).toBe(false);
  });
  it("handles syntax-error input through the normalization fallback", () => {
    expect(latexEquals("\\frac{1}{", "\\frac{1}{2}")).toBe(false);
  });
  it("roman type: treats \\mathrm{d}x and dx as equivalent", () => {
    expect(latexEquals("\\int x^2 \\mathrm{d}x", "\\int x^2 dx")).toBe(true);
  });
  it("roman type: treats \\dd x and dx as equivalent", () => {
    expect(latexEquals("\\dd x", "dx")).toBe(true);
    expect(latexEquals("dx", "\\dd x")).toBe(true);
  });
  it("roman type: treats \\mathrm{tr} and tr as equivalent", () => {
    expect(latexEquals("\\mathrm{tr}(AB)", "tr(AB)")).toBe(true);
  });
  it("still rejects roman-type expressions with different content", () => {
    expect(latexEquals("\\mathrm{d}y", "dx")).toBe(false);
  });
  it("supports braket notation", () => {
    expect(latexEquals("\\braket{\\phi|\\psi}", "\\braket{\\phi | \\psi}")).toBe(
      true,
    );
  });
});

describe("latexEquals: additional accepted notation rules", () => {
  it("allows omitted \\, between an integral and dx", () => {
    expect(latexEquals("\\int x^2 dx", "\\int x^2 \\, dx")).toBe(true);
    expect(latexEquals("\\int x^2 \\, dx", "\\int x^2 dx")).toBe(true);
  });
  it("also allows omitted spacing commands such as \\; \\: \\! and \\quad", () => {
    expect(latexEquals("a b", "a \\quad b")).toBe(true);
    expect(latexEquals("a+b", "a\\!+\\;b")).toBe(true);
  });
  it("allows {} to be omitted for one-character \\frac arguments", () => {
    expect(latexEquals("\\frac lg", "\\frac{l}{g}")).toBe(true);
    expect(latexEquals("T = 2\\pi\\sqrt{\\frac lg}", "T = 2\\pi\\sqrt{\\frac{l}{g}}")).toBe(true);
    expect(latexEquals("\\frac12", "\\frac{1}{2}")).toBe(true);
  });
  it("allows absolute value as |, \\lvert\\rvert, or \\abs", () => {
    expect(latexEquals("\\lvert x \\rvert", "|x|")).toBe(true);
    expect(latexEquals("\\abs{x}", "|x|")).toBe(true);
    expect(latexEquals("\\abs{x}", "\\lvert x \\rvert")).toBe(true);
    expect(latexEquals("\\left| x \\right|", "|x|")).toBe(true);
  });
  it("allows primes written as ' or \\prime", () => {
    expect(latexEquals("f'(x)", "f^{\\prime}(x)")).toBe(true);
    expect(latexEquals("f'", "f\\prime")).toBe(true);
    expect(latexEquals("x'", "x^\\prime")).toBe(true);
  });
  it("allows fractions written with \\frac or {A \\over B}", () => {
    expect(latexEquals("\\frac{a}{b}", "{a \\over b}")).toBe(true);
    expect(latexEquals("{a+b \\over c}", "\\frac{a+b}{c}")).toBe(true);
  });
  it("still rejects absolute values and fractions with different content", () => {
    expect(latexEquals("\\abs{x}", "|y|")).toBe(false);
    expect(latexEquals("{a \\over b}", "\\frac{a}{c}")).toBe(false);
  });
});

describe("latexEquals: differential d can be plain d, \\dd, or roman d", () => {
  it("matches dx, \\dd x, and \\mathrm{d}x", () => {
    expect(latexEquals("\\int x^2 dx", "\\int x^2 \\, \\dd x")).toBe(true);
    expect(latexEquals("\\int x^2 \\dd x", "\\int x^2 dx")).toBe(true);
    expect(latexEquals("\\int x^2 \\mathrm{d}x", "\\int x^2 \\dd x")).toBe(true);
  });
  it("Gaussian integral: dx notation matches the model answer using \\, \\dd x", () => {
    expect(
      latexEquals(
        "\\int_{-\\infty}^{\\infty} e^{-x^2} dx=\\sqrt \\pi",
        "\\int_{-\\infty}^{\\infty} e^{-x^2} \\, \\dd x = \\sqrt{\\pi}",
      ),
    ).toBe(true);
  });
  it("also treats \\mathrm{d} and \\mathrm d as differential d", () => {
    expect(latexEquals("\\mathrm{d}x", "\\dd x")).toBe(true);
    expect(latexEquals("\\mathrm dx", "\\dd x")).toBe(true);
    expect(latexEquals("\\mathrm dx", "dx")).toBe(true);
  });
});

describe("latexEquals: \\frac{A}B with one-character denominator and omitted braces", () => {
  it("matches \\frac{\\sin x}x and \\frac{\\sin x}{x}", () => {
    expect(latexEquals("\\frac{\\sin x}x", "\\frac{\\sin x}{x}")).toBe(true);
  });
  it("matches \\frac{\\pi}2 and \\frac{\\pi}{2}", () => {
    expect(latexEquals("\\frac{\\pi}2", "\\frac{\\pi}{2}")).toBe(true);
  });
  it("Dirichlet integral: real input with \\frac{A}B and \\mathrm dx matches the model answer", () => {
    expect(
      latexEquals(
        "\\int_0^\\infty\\frac{\\sin x}x\\mathrm dx =\\frac{\\pi}2",
        "\\int_0^\\infty \\frac{\\sin x}{x} \\, \\dd x = \\frac{\\pi}{2}",
      ),
    ).toBe(true);
  });
});

describe("latexEquals: physics \\pdv / \\dv with optional order", () => {
  it("matches \\pdv[2]{x}{t} and \\frac{\\partial^2 x}{\\partial t^2}", () => {
    expect(
      latexEquals("\\pdv[2]{x}{t}", "\\frac{\\partial^2 x}{\\partial t^2}"),
    ).toBe(true);
  });
  it("matches \\pdv{f}{x} and \\frac{\\partial f}{\\partial x}", () => {
    expect(latexEquals("\\pdv{f}{x}", "\\frac{\\partial f}{\\partial x}")).toBe(
      true,
    );
  });
  it("matches \\dv[2]{x}{t} and \\frac{\\mathrm{d}^2 x}{\\mathrm{d} t^2}", () => {
    expect(
      latexEquals("\\dv[2]{x}{t}", "\\frac{\\mathrm{d}^2 x}{\\mathrm{d} t^2}"),
    ).toBe(true);
  });
  it("one-dimensional wave equation: \\pdv[2] notation matches raw \\partial notation", () => {
    expect(
      latexEquals(
        "\\pdv[2]{u}{t} = c^2 \\pdv[2]{u}{x}",
        "\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\frac{\\partial^2 u}{\\partial x^2}",
      ),
    ).toBe(true);
  });
  it("rejects different derivative orders", () => {
    expect(latexEquals("\\pdv[2]{x}{t}", "\\pdv[3]{x}{t}")).toBe(false);
  });
});

describe("latexEquals: real screenshot cases using AST comparison", () => {
  it("sum of cubes: superscript and subscript order may be reversed", () => {
    expect(
      latexEquals(
        "\\sum^n_{k=1}k^3=\\left\\{ \\frac{n(n+1)}{2}\\right\\}^2",
        "\\sum_{k=1}^{n} k^3 = \\left\\{ \\frac{n(n+1)}{2} \\right\\}^2",
      ),
    ).toBe(true);
  });
  it("double angle: spaces are optional", () => {
    expect(
      latexEquals(
        "\\cos2\\theta=1-2\\sin^2\\theta",
        "\\cos 2\\theta = 1 - 2\\sin^2\\theta",
      ),
    ).toBe(true);
  });
  it("simple pendulum: \\sqrt\\frac lg with omitted braces", () => {
    expect(
      latexEquals("T=2\\pi\\sqrt\\frac lg", "T = 2\\pi\\sqrt{\\frac{l}{g}}"),
    ).toBe(true);
  });
  it("combinations: {}_n and _n with or without empty braces", () => {
    expect(
      latexEquals(
        "_n\\mathrm{C}_r = \\frac{n!}{r!(n-r)!}",
        "{}_n \\mathrm{C}_r = \\frac{n!}{r!(n-r)!}",
      ),
    ).toBe(true);
  });
  it("Bessel: multiple primes ^{\\prime\\prime} and '' are equivalent", () => {
    expect(
      latexEquals(
        "x^2y^{\\prime\\prime} + xy^\\prime + (x^2 - n^2) y = 0",
        "x^2 y'' + x y' + (x^2 - n^2) y = 0",
      ),
    ).toBe(true);
  });
  it("braket: \\langle\\phi\\vert\\psi\\rangle matches \\braket{\\phi|\\psi}", () => {
    expect(
      latexEquals("\\langle \\phi\\vert\\psi\\rangle", "\\braket{\\phi|\\psi}"),
    ).toBe(true);
  });
  it("bra and ket also match handwritten delimiters", () => {
    expect(latexEquals("\\langle \\psi|", "\\bra{\\psi}")).toBe(true);
    expect(latexEquals("|\\psi\\rangle", "\\ket{\\psi}")).toBe(true);
  });
});
