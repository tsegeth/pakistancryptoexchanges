# pakistancryptoexchanges.com

Single-page comparison and review site for crypto exchanges serving Pakistani
rupee users. Hand-written static HTML, one stylesheet, one script, no build step.

```
public/             everything that ships (this is the publish directory)
  index.html        the whole site (hero, comparison table, 8 reviews, method, red flags, tax)
  ui/theme.css      design system
  ui/interactions.js  date stamping, table filter, column sorting, mobile menu
  ui/dates.json     the year every figure was last checked
  ui/img/*.webp     per-exchange illustrations (transparent)
  favicon.*, icon-*  brand marks
  robots.txt, sitemap.xml, llms.txt
```

Editing rules that matter:

- Every figure carries the year it was checked. Unverified figures are published
  as an em dash, never estimated.
- Fees come from each exchange's own fee schedule; volume, trust score, founding
  year come from CoinGecko; public review scores come from Trustpilot.
- Affiliate links are `rel="nofollow sponsored noopener"` and never change a
  score or a position.

Deploy: Sevalla static site, auto-deploy on push to `main`. No build command,
publish directory is `public`.
