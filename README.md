# NutriPlate

A responsive recipe discovery website built with React. Five primary pages (Home, Recipes, Meal Plans, Nutrition Basics, Contact), plus individual recipe routes. No backend, accounts, database, or paid API is required.

## Run in VS Code

Open this **NutriPlate** directory with File → Open Folder. In the integrated terminal:

```sh
npm ci
npm run dev
```

Open the local URL printed in the terminal (normally http://127.0.0.1:5173). Keep the terminal running while editing. Node 22.19+ or Node 24 LTS is recommended for all tools, including the optional Lighthouse audit; the main Vite app also runs on Node 22.15.

## Build and check

```sh
npm run test           # Frontend unit/integration tests
npm run build          # Production files in dist/
npm run preview        # Local production preview
npm run test:e2e       # Browser, responsive, and axe accessibility checks
npm run audit          # Lighthouse performance/accessibility report
```

Browser tests use installed Google Chrome on macOS. On another platform, install Playwright Chromium once with `npx playwright install chromium`. The audit script starts its own temporary preview server. Audit results are local measurements, not a guarantee of WCAG conformance or live-site performance.

## Main features

- Twelve recipes with original instructions and locally hosted, credited food photography.
- Search recipe names and ingredients with a 300ms debounce, combined with meal, time, dietary preference, and protein filters.
- Filters stored in the URL; sort by name or preparation time, reset filters, and recover from empty results.
- Recipe detail pages, ingredient checkboxes, breadcrumbs, and a print stylesheet.
- Curated three-day and seven-day example menus linking to the same recipe records.
- An accessible local form with associated errors, an error summary, focus management, and clear demo-only success feedback. **It does not send or save messages.**
- Semantic landmarks, a skip link, visible focus, native form controls, route titles/focus, reduced-motion support, and responsive layouts at 600, 900, and 1200 CSS pixels.
- WebP images with width variants, `srcset`, reserved dimensions, lazy loading, and locally bundled fonts.

## Deploy to GitHub Pages

1. Create a GitHub repository for the contents of this folder, not the surrounding workspace.
2. Commit and push to the `main` branch.
3. In the repository, select **Settings → Pages → Source → GitHub Actions**.
4. Run the included **Deploy NutriPlate to GitHub Pages** workflow, or push another commit to `main`.
5. Use the deployed Pages URL in your presentation and README.

The workflow builds and publishes `dist/`. Relative Vite asset paths work beneath a repository subdirectory. Hash-based routes (for example `/#/recipes/harvest-salad`) allow refresh and direct links on GitHub Pages without server rewrites. GitHub Pages deployment has **not** been performed as part of local development; there is no live URL until the repository is configured.

Guides: [Vite deployment](https://vite.dev/guide/static-deploy#github-pages) · [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

## Progressive enhancement and limitations

The interactive React application requires JavaScript. The initial HTML includes a link to `recipes.html`, generated from the same recipe data before development/build. That separate static page contains all ingredients, instructions, and a three-day menu; it works and prints without JavaScript. Search/filtering and the contact form remain JavaScript-dependent. This is a content fallback, not full SPA functionality without JavaScript.

Recipes are illustrative coursework content, not kitchen-tested or personalized nutrition plans. Cooking times are estimates. Photos show serving ideas and may differ from the exact instructions. General food education and cooking safety sources are linked on the relevant pages. No nutrition totals or clinical claims are generated.

WebMCP filter support is progressively registered only when `document.modelContext` exists. The visual controls are always the main interface. Automated contract tests can exercise this through a stub; native browser support is not assumed.

## Documentation

- `docs/ARCHITECTURE.md`: source structure, data flow, design, and CSS decisions.
- `docs/ACCESSIBILITY.md`: automated evidence, manual review checklist, and limitations.
- `docs/IMAGE_CREDITS.md`: photographers, source pages, and image licenses.
- `docs/THIRD_PARTY_LICENSES.md`: runtime libraries, fonts, and development tools.
- `docs/qa/`: generated test evidence and screenshots.
- [Validation summary](docs/qa/VALIDATION.md): 10 frontend tests and 19 browser tests passed; local mobile Lighthouse scores are 91/100/100/100 (Performance/Accessibility/Best Practices/SEO).

The final design PDF and presentation slides are separate deliverables to prepare after reviewing the finished website. The presentation is planned as an in-person talk with a live website demo.
