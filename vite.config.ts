import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages serves project pages at https://<user>.github.io/<repo>/,
// so project pages must set base to "/<repo>/".
// This is computed from GITHUB_REPOSITORY, which GitHub Actions sets automatically,
// so no configuration change is needed if the repository name changes.
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base = repo && !repo.endsWith(".github.io") ? `/${repo}/` : "/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
});
