# Legacy Seabee route audit

The following files are legacy SeaBee Jack's content. They are not linked from the Big Boys navigation and are excluded from `sitemap.xml`, but a static host will still serve them if they remain deployed.

## Required launch action

Before switching the production domain, configure the host to return a 301 to the relevant Big Boys route or a 410 for every legacy route below. Do **not** publish these pages under the Big Boys domain.

### Legacy services → Big Boys services

- `services/mobile-oil-change.html`, `services/fluid-service.html`, `services/filters-tune-up.html`, `services/multi-point-inspection.html` → `services/junk-removal.html`
- `services/brake-service.html`, `services/battery-test-replace.html`, `services/mobile-auto-repair.html`, `services/fleet-service.html` → `services/commercial-junk-removal.html` or 410 after confirming no relevant Big Boys equivalent

### Legacy Arizona service-area and blog pages

- All existing `service-areas/*.html` legacy Arizona pages → 410
- All existing `blog/*.html` oil-change, battery, brake, and Arizona-maintenance posts not listed in `sitemap.xml` → 410

The user-provided scope requires preserving relevant Big Boys SEO content—not unrelated Seabee auto-service SEO content. Keeping these URLs indexable after deployment would create an inaccurate, mixed-brand website.
