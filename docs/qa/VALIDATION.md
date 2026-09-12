# Website validation — first complete version

Checked on September 10, 2026 (America/Los_Angeles). The reports use UTC timestamps; the final Lighthouse run is `2026-09-11T02:47:33.864Z`.

## Results

| Check | Result |
| --- | --- |
| Vitest frontend unit/integration suite | 10 passed |
| Vite production build | Passed |
| Playwright browser suite | 19 passed |
| axe checks | No detected violations across six routes at both 390px and 1440px |
| Intermediate layout checks | No horizontal overflow at 600px, 900px, and 1200px on the recipe collection |
| Lighthouse mobile home-page simulation | Performance 91; Accessibility 100; Best Practices 100; SEO 100 |

Browser tests cover keyboard entry and skip navigation, mobile navigation, route focus, search and filtering, direct-link refresh, ingredient checkboxes, print visibility, image loading, form errors and success focus, a JavaScript-disabled recipe collection, and 200% text enlargement. The WebMCP test uses a controlled registry fixture rather than native browser integration.

## Evidence

- [Browser results](browser-test-results.json)
- [Final Lighthouse report](lighthouse-home.html)
- [Final Lighthouse summary](lighthouse-home-summary.json)
- [Initial Lighthouse summary](lighthouse-home-initial-summary.json)
- `axe*.json`: individual route audit results, including items needing human review.
- `page*.png`: full-page screenshots at mobile and desktop widths.

## Issues addressed during verification

1. Card and detail images inherited a fixed HTML height that overrode the intended responsive proportions. Explicit `height: auto` now lets their CSS aspect ratios determine the rendered height.
2. Initial rendering focused the main heading. Route focus now occurs after a pathname change, preserving keyboard entry from the first skip link on an initial visit. A separate test setup issue was corrected: clicking the page before pressing Tab changes Chrome's sequential focus starting point, so the keyboard-entry test now starts from a fresh page without a mouse click.
3. Lighthouse found that recipe-link `aria-label` overrides omitted other visible link text. Removing those overrides lets the visible content supply the accessible name; the final report no longer flags the mismatch.
4. Lighthouse found a missing favicon and a missing `robots.txt` (the preview server returned HTML at that path). Local static versions resolve both findings. Best Practices increased from 96 to 100 and SEO from 92 to 100 in this local run.

## Limits and next checks

These results describe a local production build in headless Google Chrome. Scores can vary between runs and are not live-site measurements or a WCAG conformance certification. Lighthouse still identifies opportunities to reduce image transfer, JavaScript, and render-blocking work; the current performance score is 91.

The [human accessibility checklist](../ACCESSIBILITY.md) remains open, especially a VoiceOver/NVDA review, physical-device checks, and checking the eventual deployment on the classroom network. GitHub Pages has not been deployed. Final design documentation and presentation slides remain separate coursework deliverables.
