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

Deploy: Sevalla static site `a01f1bef-82c1-4778-ab19-7922d46453a0`, root `.`,
publish directory `public`, no build command. Because Sevalla pulls this repo
by public URL it gets no GitHub webhooks, so `.github/workflows/deploy.yml`
triggers the deployment through the Sevalla API on every push to `main`
(needs the `SEVALLA_API_KEY` repo secret).
