# Verification

Verified against the exported production website on 17 September 2026.

- Production build and TypeScript checks pass.
- 20 browser checks pass, covering the collection, product photos, keyboard navigation, mobile menu, FAQ, enquiry validation, generated WhatsApp messages and business data.
- No horizontal overflow at 320, 375, 768, 1024 or 1440 pixels.
- Automated WCAG A/AA scans report zero violations in mobile and desktop light/dark modes and in the product dialog. Automated results do not replace a full manual accessibility review.
- All nine initial photos and all 55 photos from the four category folders are used; originals remain intact.
- Gallery checks pass for category counts, direct category links, keyboard navigation, photo references, mobile layouts and light/dark accessibility scans.
- No enquiry was sent during testing. WhatsApp opening was stubbed for message verification.

## Mobile Lighthouse audit

Run against the compressed local production preview using Lighthouse 13.4.1 and its default mobile simulation:

| Measure | Result |
| --- | --- |
| Performance | 97/100 |
| Accessibility | 100/100 |
| Best practices | 100/100 |
| Largest contentful paint | 2.4 seconds |
| Cumulative layout shift | 0 |

These are historical local lab results from the initial homepage, before the gallery was added; public hosting, visitor devices and networks affect real performance. The local preview SEO score was 66/100 because it deliberately used `noindex` without a public domain. The production build now derives its real origin from Vercel, enables indexing and generates canonical, sitemap and absolute social-image URLs. See README.md and SEO-LAUNCH.md.

## Production deployment

Deployed on 17 September 2026 to https://hotel-and-resturant-furniture.vercel.app/ using Next.js on Vercel. Deployment `dpl_HYtPEDR1XWpDjdhpeMuWFbD49g1M` is READY, target production, from source commit `43535899643b915fcd4d3b307f092884c6f4b936`. Vercel reported a 28-second build. Anonymous homepage access returns HTTP 200; canonical uses the public origin and robots metadata permits indexing. The Vercel runtime error query for the first hour returned no errors. No external monitoring or log drains were added during this work.

Raw audit reports, test results and screenshots are in `test-results/` (excluded from version control).
