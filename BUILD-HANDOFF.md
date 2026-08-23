# Big Boys Junk Removal — pre-deployment handoff

## Implemented routes

- Home: `/`
- Quote flow: `/get-a-price-quote.html`
- Primary locations: `/atlanta/`, `/suwanee/`
- Supporting city pages: `/marietta/`, `/decatur/`, `/roswell/`, `/alpharetta/`, `/buford/`, `/lawrenceville/`, `/sandy-springs/`, `/kennesaw/`, `/smyrna/`, `/tucker/`, `/clarkston/`, `/chamblee/`, `/brookhaven/`, and `/stone-mountain/`
- Services index plus nine verified service detail pages under `/services/`
- Service areas: `/service-areas/index.html`
- Blog index plus four migrated Big Boys article routes under `/blog/`
- About, contact, privacy, and terms pages

## Design, conversion, and SEO direction

- Preserve the clean white-and-green Big Boys palette while retaining the direct, local-service clarity of the original SeaBee Jacks build.
- The quote route now follows the supplied five-step references: method, items/load size, details, transparent price, and booking request.
- Quote options include popular item pricing, eight trailer-load tiers, stairs, disassembly, same-day priority, an itemized total, and mobile-responsive booking fields.
- The supplied 60-photo junk-removal archive has been converted from HEIC/JPEG to optimized local JPG files (maximum 1800px, progressive quality 82). The homepage uses selected before/after sequences with descriptive alternative text, explicit dimensions, and deferred loading for noncritical images.
- Nine supplied Google review excerpts are rendered from `content.js`; the supplied 4.9/127 aggregate is reflected in the homepage presentation and business structured data.
- Homepage SEO includes upgraded title/description, canonical/robots directives, Open Graph metadata, geographic signals, verification metadata, and Organization/LocalBusiness/WebSite JSON-LD.
- City and service routes provide the intended internal-linking architecture, with `sitemap.xml`, `robots.txt`, and `redirects.csv` prepared for launch configuration.

## Production steps required

1. Configure the platform to serve folder routes without `.html` and apply every 301 in `redirects.csv`.
2. Connect `quote.js` to an approved lead/scheduling integration. The current confirmation step intentionally does **not** transmit customer data.
3. Confirm published claims, review source/rating, business address display, service coverage, and current pricing before launch.
4. Delete or redirect the legacy SeaBee-only files that are not in the sitemap before the domain switch; they are intentionally not part of the new Big Boys route architecture.
   See `LEGACY-ROUTE-AUDIT.md` for the exact inventory and recommended handling.

## Known audit boundaries

- Private quote-system integrations, photo uploads, and booking/calendar logic were not accessible from the public site and were not reproduced without authorized credentials.
- Supporting-market pages are intentionally single-city pages, not service × city doorway grids. Expand only where there is enough distinct local content to justify the page.
