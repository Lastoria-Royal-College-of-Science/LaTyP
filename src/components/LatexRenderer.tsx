import { useMemo } from "react";
import katex from "katex";
import { katexMacros } from "../lib/katexMacros";
import { expandDerivatives } from "../lib/latexPreprocess";

type Props = {
  latex: string;
  displayMode?: boolean;
  className?: string;
  /** Placeholder displayed when there is a syntax error. */
  fallback?: string;
};

/**
 * Shared component that renders a LaTeX string with KaTeX.
 * Custom macros equivalent to physics / bm / braket are always applied.
 */
export default function LatexRenderer({
  latex,
  displayMode = true,
  className = "",
  fallback = "...",
}: Props) {
  const { html, error } = useMemo(() => {
    if (!latex.trim()) return { html: "", error: false };
    try {
      const html = katex.renderToString(expandDerivatives(latex), {
        displayMode,
        macros: { ...katexMacros },
        throwOnError: true,
        strict: false,
        trust: false,
      });
      return { html, error: false };
    } catch {
      return { html: "", error: true };
    }
  }, [latex, displayMode]);

  if (!latex.trim()) {
    return <span className={`text-gray-300 ${className}`}>{fallback}</span>;
  }
  if (error) {
    return (
      <span className={`text-amber-500 text-sm ${className}`}>
        Syntax error. Still typing?
      </span>
    );
  }
  return (
    <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
