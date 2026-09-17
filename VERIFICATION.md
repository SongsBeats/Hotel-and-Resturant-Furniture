# Verification

Verified against the exported production website on 17 September 2026.

- Production build and TypeScript checks pass.
- 20 browser checks pass, covering the collection, product photos, keyboard navigation, mobile menu, FAQ, enquiry validation, generated WhatsApp messages and business data.
- No horizontal overflow at 320, 375, 768, 1024 or 1440 pixels.
- Automated WCAG A/AA scans report zero violations in mobile and desktop light/dark modes and in the product dialog. Automated results do not replace a full manual accessibility review.
- All nine supplied photos are used; originals remain intact.
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

These are local lab results; public hosting, visitor devices and networks affect real performance. The SEO score is 66/100 because this preview deliberately has `noindex` until its real public domain is configured. Set `NEXT_PUBLIC_SITE_URL` before the production build to enable indexing and generate the canonical, sitemap and absolute social-image URLs. See README.md and SEO-LAUNCH.md.

Raw audit reports, test results and screenshots are in `test-results/` (excluded from version control).
