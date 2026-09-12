# Accessibility and validation

## Scope

Target: WCAG 2.2 AA principles across the five main pages and recipe detail routes. Automated tools are useful checks, not certification. A human screen-reader review is still needed before making a broad conformance claim.

## Implemented behavior

- **Perceivable:** food-image alternatives, readable labels, consistent hierarchy, text and background contrast, field errors expressed in text as well as color, responsive text and images.
- **Operable:** skip link, visible focus, keyboard-operable native controls, mobile menu state and Escape handling, recipe ingredient checkboxes, route focus, print view, and reduced-motion support.
- **Understandable:** consistent navigation, descriptive recipe links, empty-state recovery, associated error messages, validation summary, clear no-send/no-storage form result.
- **Robust:** semantic header/nav/main/footer, headings, lists, labels, fieldsets, native details/radios/selects, limited ARIA for state and feedback, meaningful page titles.

## Automated evidence

Run `npm test` for frontend integration tests and `npm run test:e2e` for browser verification. The browser suite checks axe WCAG rules at mobile and desktop widths, horizontal overflow, all card image loads, direct-link refresh, skip navigation, route focus, form focus, 200% text enlargement, printing behavior, and reading all recipes with JavaScript disabled.

`npm run audit` writes a separate Lighthouse mobile-simulation HTML report and JSON summary from the production build. Lighthouse requires Node 22.19+; use Node 24 LTS for all project tooling.

Results are written to `docs/qa/`. Check timestamps and rerun after significant changes. The completed run is recorded in [docs/qa/VALIDATION.md](qa/VALIDATION.md): 10 frontend tests and 19 browser tests passed, with no detected axe violations in the 12 route/viewport audits. Lighthouse's local home-page accessibility score is 100.

## Human review checklist

- [ ] Navigate the complete site with only Tab, Shift+Tab, Enter, Space, and Escape.
- [ ] Confirm headings, landmarks, image descriptions, and route announcements with VoiceOver or NVDA.
- [ ] Listen to search result updates and validation error announcements.
- [ ] Review the site's text and layouts at 200% browser zoom on the presentation computer.
- [ ] Confirm the printed recipe is comfortable to read on paper.
- [ ] Review each recipe image's description and each external content source for suitability.
- [ ] Run the deployed GitHub Pages site on a real phone and check it on the classroom network.

The checklist remains unchecked until a person performs these checks; automated keyboard tests are recorded separately and do not substitute for a human screen-reader audit.

## Progressive enhancement boundary

The React app needs JavaScript for navigation, filtering, and the demo form. `recipes.html` contains all recipe content and a three-day menu independently of JavaScript. It is generated from the same data to avoid content drift. No JavaScript-free form submission is claimed, because no backend or delivery service is present.

## WebMCP boundary

The filtering tool is feature-detected. The contract test uses a controlled registry fixture to verify registration, input validation, and matching UI updates. This does not establish native browser WebMCP compatibility.
