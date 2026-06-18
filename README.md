# Math Typing — Math Typing Game

A feature-rich web typing game for physics and mathematics formulas written in LaTeX.
The game randomly selects questions from a large formula pool and uses flexible answer checking that accepts equivalent notation when the meaning matches.

## Features

- **Three difficulty levels** — High school / University / Mixed (100+ total questions)
  - High school: calculus, vectors, trigonometric functions, and mechanics
  - University: linear algebra, analysis, electromagnetism, quantum mechanics, and mathematical physics (Fourier transforms, Laurent series, special functions)
  - Mixed: all topics mixed with applied physics (partition functions, Berry phase and curvature, Schwarzschild metric, transfer matrices, Fermi-Dirac/Bose-Einstein distributions, first-order perturbation, and more)
- **KaTeX rendering** — supports `physics` (`\dd`, `\grad`, `\rot`, ...), `bm` (`\bm`), and `braket` (`\bra`, `\ket`, `\braket`) macros
- **Flexible answer checking** — compares KaTeX rendering results instead of requiring exact string matches, accepting notation differences such as:
  - Spaces or no spaces (`\int x dx` ⇔ `\int xdx`)
  - Optional braces (`\frac12` ⇔ `\frac{1}{2}`)
  - Command synonyms (`\to` ⇔ `\rightarrow`)
  - Equivalent macro expansions (`\bm{v}` ⇔ `\boldsymbol{v}`)
  - Roman type for differentials (`\mathrm{d}x` ⇔ `dx` ⇔ `\dd x`)
- **Game system** — time limits based on formula length (20-60 seconds), Pass function, and real-time previews for both the target and your input
- **Scoring** — base points (character count × difficulty multiplier) plus a time bonus based on the remaining time
- **Results and review** — check your score, accuracy, result breakdown, and the model LaTeX for every question that appeared

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- KaTeX (formula rendering)
- Vitest (unit tests)

## Development

```bash
npm install
npm run dev      # Start the development server
npm test         # Run unit tests for normalization logic and rendering validation for all questions
npm run build    # Build for production
```

## License

MIT License
