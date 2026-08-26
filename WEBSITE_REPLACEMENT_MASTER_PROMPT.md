# Big Boys Junk Removal: Website Replacement Master Prompt

## Mission

Update the Big Boys Junk Removal codebase we built here and deploy it as the replacement production website. Do not build or modify the website inside Lovable.

The client's current Lovable website is a visual, structural, and functional benchmark only. Study it to understand the design the client approved, the customer journey, and the working business behavior. Reproduce that experience in this codebase while adding the missing photos, SEO foundations, service pages, service-area pages, FAQs, blogs, navigation, and content depth.

The completed replacement should look and behave so much like the client's approved site that a returning customer experiences it as the same website, only cleaner, more complete, more trustworthy, and better optimized for search.

## Source-of-truth hierarchy

When sources conflict, use this order:

1. Verified production business functionality, stored data, pricing, form destinations, and integrations
2. The client's current website for approved design, page structure, visual language, and customer flow
3. Verified client facts, photos, reviews, services, locations, and policies
4. This repository as the implementation target
5. The previous reference build only for ideas about missing content and features

Never push code into, regenerate, or depend on the Lovable project. The final website must run independently from this repository and its configured production services.

## What “keep the same design” means

Treat design preservation as a testable requirement:

- Match the approved logo treatment, white-and-green palette, typography, spacing rhythm, content width, cards, buttons, borders, header, footer, responsive behavior, and overall section order.
- Reuse the existing component patterns instead of introducing another template or design system.
- Do not add gradients, decorative clutter, random photo strips, excessive animation, or a new visual style.
- Content additions may make pages longer, but they should not make them feel like different pages.
- Any intentional visual difference must directly support navigation, authentic proof, mobile usability, accessibility, or the approved new content.

Use baseline and replacement screenshots at matching viewport sizes to verify this rather than relying on memory.

## How customers actually use the site

- In the first five seconds, visitors need to know what the company removes, where it works, and how to get a price.
- Mobile visitors need direct access to Services, Service Areas, Blog, Contact, phone, and the quote flow.
- Customers comparing companies look for authentic photos, real reviews, transparent expectations, and evidence that the crew is legitimate.
- Customers planning a difficult cleanout need answers about access, stairs, heavy items, timing, restrictions, and pricing factors before they feel safe booking.
- Search visitors often land on a service or city page first, so every interior page needs context, trust, and a clear next step.
- Ready-to-book visitors should encounter one consistent primary CTA without the site feeling aggressive.

## Protected functionality and data

Preserve the currently working systems and production connections:

- Supabase project, tables, policies, authentication, functions, and environment values
- Quote funnel state, fields, step order, item catalog, load pricing, calculations, discounts, booking, and confirmation behavior
- Lead and callback submissions and their existing destinations
- Admin login, catalog manager, lead manager, SEO tools, analytics, web-vitals, and tracking
- Chat and any existing email or SMS behavior
- Existing production domain, Vercel project settings, secrets, and environment configuration

Do not replace real integrations with mock data or hard-coded results. Do not reset or reconnect Supabase. Do not modify protected backend behavior merely to make a front-end change easier.

Protected paths include:

- `.env` and deployment secrets
- `src/integrations/supabase/**`
- `supabase/**`
- `src/context/FunnelContext.tsx`
- `src/components/admin/**`
- `src/pages/Admin.tsx`
- `src/pages/ResetPassword.tsx`
- `src/pages/Unsubscribe.tsx`
- `src/components/ChatWidget.tsx`
- integration, authentication, pricing, tracking, and submission logic

If a required enhancement conflicts with protected functionality, stop and document the conflict instead of silently changing the business system.

## Truth and content rules

Do not invent reviews, customer names, ratings, prices, years in business, addresses, certifications, insurance status, background checks, guarantees, service boundaries, disposal claims, donation claims, recycling claims, or availability.

Use verified client material. Clearly flag missing facts or photography for client review. Never create a fake local office to support a city page. Never imply that a reference or stock photo depicts the company when it does not.

## Required implementation

### Navigation

Keep the approved header design while adding separate Services and Service Areas menus on desktop and mobile. The mobile menu must scroll and expose Services, Service Areas, Blog, Contact, phone, and quote actions. Menus must work by keyboard and touch, include visible focus states, and use accessible expanded-state attributes.

Expose all 10 service routes:

- `/services/junk-removal`
- `/services/furniture-removal`
- `/services/appliance-removal`
- `/services/mattress-removal`
- `/services/hot-tub-removal`
- `/services/cleanouts`
- `/services/yard-waste-removal`
- `/services/construction-debris`
- `/services/commercial-junk-removal`
- `/services/whole-property-cleanouts`

Expose all 16 service-area routes:

- `/atlanta`
- `/suwanee`
- `/buford`
- `/lawrenceville`
- `/marietta`
- `/decatur`
- `/roswell`
- `/alpharetta`
- `/sandy-springs`
- `/kennesaw`
- `/smyrna`
- `/tucker`
- `/clarkston`
- `/chamblee`
- `/brookhaven`
- `/stone-mountain`

### Authentic photography

- Inventory all client-supplied job, crew, truck, before-and-after, and cleanout photos.
- Match each photo to the page where it proves the strongest relevant claim.
- Use one strong hero image or restrained background treatment with readable text and correct mobile cropping.
- Use a focused before-and-after interaction rather than a noisy gallery.
- Do not place a random photo strip before the hero.
- Convert and compress assets to WebP or AVIF where appropriate.
- Set explicit dimensions to prevent layout shift and lazy-load below-the-fold images.
- Use descriptive filenames and accurate alt text. Use empty alt text for decoration.
- Do not stretch small images or reuse the same photo across adjacent sections.

### SEO foundation

- Give every indexable page exactly one descriptive H1 aligned with its search intent.
- Write a unique natural title and meta description for every indexable route.
- Set canonical URLs to the final production domain.
- Maintain favicon, logo, Open Graph, Twitter/social sharing, and text-message preview metadata.
- Use LocalBusiness, Service, Article, BreadcrumbList, and FAQPage structured data only when visible content supports it.
- Maintain `robots.txt`, XML sitemap coverage, heading hierarchy, image alt text, and descriptive internal links.
- Do not keyword-stuff, hide keywords, or create thin doorway pages.
- Every city page must provide useful unique information beyond replacing a city name.
- Avoid mass-producing service-city combinations unless each page has enough verified distinct value.

### Service pages

Use the approved service-page design and expand the content within it. Each service page needs a precise service-and-location H1, a clear summary, accepted item or project examples, process steps, preparation and access guidance, verified disposal expectations, honest pricing factors, service-specific FAQs, related service and city links, and the existing quote and callback paths.

### Service-area pages

Each city needs a standalone indexable page with an H1 in the form `Junk Removal in [City], GA`, unique metadata, canonical URL, verified coverage information, relevant services, process, FAQs, trust signals, nearby served communities, and booking options. Do not claim an unverified address or physical office.

### Reviews, FAQs, and trust

- Use only verified supplied reviews and an accurate aggregate rating.
- Place concise social proof near or directly below the hero using the approved component style.
- Keep a fuller review section later in the journey.
- Answer real buying questions about cost factors, scheduling, accepted items, restricted materials, preparation, stairs, disassembly, apartments, commercial jobs, availability, and post-pickup handling.
- Keep answers direct and page-specific. Do not overpromise.

### Blog content

Keep the approved blog-card and article presentation. The blog index must expose eight substantial guides covering cost, junk removal versus dumpster rental, accepted items, garage decluttering, estate cleanouts, pickup preparation, furniture removal, and appliance removal.

Every article needs one clear H1, logical H2/H3 structure, useful original content, natural service and city links, Article and BreadcrumbList schema, and a relevant next step. Add FAQPage schema only when visible FAQs exist. Avoid filler, repeated paragraphs, fake statistics, generic AI language, and unsupported local claims.

### Conversion and quote experience

Do not redesign or rebuild the quote system. Preserve its data sources, calculations, steps, fields, and submission behavior. Make only verified responsive and usability corrections:

- Price by Item or Price by Load Size should advance immediately when selected.
- Continue and option actions should keep the active step in view rather than jumping to the document top.
- Every step should fit a narrow mobile viewport as closely as practical without hiding required information.
- CTA language should remain consistent and quote actions should route to `/book`.
- Phone and callback options should remain available for customers who need help.

## Implementation order

1. Capture the current client site and current deployment baseline at matching desktop and mobile widths.
2. Record all routes, integrations, quote behavior, form destinations, build results, console errors, and protected-file hashes.
3. Produce a page-by-page design mapping from the client benchmark to this repository.
4. Correct navigation and route discovery using the approved visual patterns.
5. Add and optimize verified images without altering the design language.
6. Correct H1s, metadata, canonicals, schemas, social metadata, sitemap, and internal linking.
7. Expand service, city, FAQ, and blog content inside existing templates.
8. Run automated and browser regression testing on desktop and mobile.
9. Deploy this repository to a preview environment on the current hosting platform.
10. Compare the preview to the client benchmark and baseline. Deploy the preview to the production project only after approval.

## Acceptance criteria

### Code and build

- `npm ci`, `npm run build`, and `npm test` pass.
- Changed files pass lint and TypeScript checks.
- No new console errors, failed requests, broken imports, or missing assets appear.

### Design fidelity

- Compare homepage, service page, city page, blog index, article, and quote flow screenshots at representative desktop and mobile sizes.
- Logo, palette, typography, width, spacing, cards, buttons, header, footer, and interaction patterns match the client benchmark.
- Differences are limited to approved content, authentic photos, added navigation entries, and required responsive fixes.

### Navigation and page coverage

- All 10 service routes, all 16 city routes, and all eight article routes load correctly.
- Desktop menus work by hover, click, and keyboard.
- Mobile menus expand independently, scroll correctly, and retain Blog and Contact access.
- Every indexable public page has exactly one relevant H1.
- Internal links have no dead ends or unintended 404s.

### Functional regression

- Both quote methods complete the established flow using the existing catalog and prices.
- Mobile step transitions keep the active content in view.
- Booking, lead, and callback submissions still use the same production destinations.
- Admin authentication and protected tools still work.
- No production form is submitted during testing without an approved test record.

### SEO and media

- Titles, descriptions, canonicals, social tags, favicon/logo assets, and schemas match visible content.
- Sitemap contains intended public routes and excludes private/admin routes.
- Location pages contain useful unique content without fake addresses.
- Images are responsive, compressed, correctly dimensioned, and accurately described.
- No claims, prices, ratings, reviews, or service facts were invented.

### Deployment safety

- Do not deploy into Lovable.
- Do not create a new production project when the intent is to replace the current deployment.
- Preserve the existing production domain, environment variables, and service connections.
- Deploy a preview first and record its URL.
- Keep the prior production deployment or commit available for immediate rollback.

## Required handoff

Return a summary, complete changed-file manifest, protected-file comparison, automated test results, responsive browser results, quote-flow regression results, SEO/media validation, unresolved client-verification questions, preview URL, production deployment record after approval, and rollback reference.

Do not make unrelated changes. Do not touch the Lovable project. Do not alter protected functionality to simplify implementation.
