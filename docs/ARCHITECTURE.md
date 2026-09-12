# Architecture and design

## Purpose and audience

NutriPlate is a fictional recipe publisher for busy adult home cooks and students. Its central task is finding a practical meal by available time, ingredients, and preferences. All visible content is English, matching the assignment proposal.

## Information architecture

```text
Home
├── Recipes — search/filter collection
│   └── Recipe detail — ingredients, steps, print
├── Meal plans — 3 or 7 curated days
├── Nutrition basics — general education and sources
└── Contact — local demonstration form

Text-only recipe collection (static, independent of JavaScript)
```

The main navigation is hierarchical; filters offer an additional non-linear path through the collection. Breadcrumbs provide a clear return path from individual recipes. Invalid routes show a recovery link.

## Source structure

```text
src/
  App.jsx                   routes, shared header/footer, route focus
  main.jsx                  React entrypoint and local fonts
  styles.css                design tokens, layout, responsive and print CSS
  components/
    Icon.jsx                consistent decorative interface icons
    RecipeCard.jsx          reusable recipe card and responsive image
    RecipeCard.module.css   component-scoped card styles
  data/
    recipes.js              12 recipes and meal-plan references
    credits.json            photo attribution data
  lib/filters.js            pure combined-filter and sorting functions
  pages/                    Home, Recipes, Detail, Plans, Nutrition, Contact
  test/                     frontend integration tests
scripts/
  generate-fallback.mjs     static no-JavaScript recipe collection
  audit.mjs                 reproducible Lighthouse run
tests/site.spec.js          browser interaction, responsive, and axe tests
public/images/              local WebP images, 480/960px variants
.github/workflows/          GitHub Pages workflow
```

## Data and state

The recipe array is the single content source. Cards, details, meal plans, search, and the static fallback all use it. Meal plans reference stable recipe IDs instead of duplicating recipe content. The dataset is bundled at build time, so no runtime API is required.

Search and filters are URL state managed by React Router. Input updates visually immediately, but text filtering waits 300ms; submitting search runs immediately. Filter changes preserve other query parameters. Matching is case-insensitive across titles, descriptions, and ingredients. Sorting copies the filtered result instead of modifying the original dataset. Empty results have a reset action.

Navigation state, ingredient checkboxes, and form feedback are local component state. No values persist to storage or leave the device. Shared application-wide state is unnecessary for this scope.

## Layout and visual decisions

The proposal's green, cream, and terracotta direction is retained, with an editorial recipe layout. Fraunces headings give the publication a recognizable voice; Inter handles reading, navigation, metadata, and controls. Fonts are locally bundled, with serif/sans-serif fallbacks.

CSS custom properties define green, ink, muted text, surfaces, borders, accent, and corners. Spacing uses a repeated 8px-based rhythm with occasional optical adjustments. CSS layers organize reset, base, layout, components, and responsive rules. Cards use CSS Modules.

Grid handles the hero, recipe collection, filter/content split, detail method, and menus. Flexbox handles navigation, search, metadata, and action groups. `box-sizing: border-box` keeps control and grid sizing predictable. Relative/absolute positioning anchors image labels and the mobile menu; the header and desktop filter panel use sticky positioning with explicit stacking order. Pseudo-classes style hover, focus-visible, checked, and active states. Native details elements provide expandable content.

Responsive thresholds are 600, 900, and 1200 CSS pixels, with single-column layouts on small screens, two-column recipe grids in intermediate layouts, and three columns on wide screens. Navigation wraps for enlarged text and becomes a disclosure menu on phones. The print stylesheet removes navigation and imagery from recipe printing and emphasizes ingredients and instructions.

The structural responsive rules begin with a single column and progressively expand through `min-width` queries. The contact introduction also demonstrates a small floated icon and a cleared paragraph; the main page structure uses Grid and Flexbox.

## Performance

Vite produces minified assets. Photos are local WebP files at 480×360 and 960×720, selected through `srcset`/`sizes`. The hero/detail image loads eagerly; non-critical images load lazily. Explicit dimensions and stable aspect ratios reduce layout movement. Font imports include only the Latin subsets and used weights. No external font, analytics, or data request is needed for normal browsing.

## Deployment

The output is static files in `dist/`. Relative assets and HashRouter support GitHub Pages repository subpaths and refreshing detail links. Source code and the optional automatic deployment workflow remain editable in VS Code. There is no backend or server-rendered application.
