# DealHound — Real Black Friday & Cyber Monday Deal Finder

[![make.fun](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/c/black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/Kopler12/kopler-black-friday-deals/rank.svg)](https://make.fun/c/black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/Kopler12/kopler-black-friday-deals/reward.svg)](https://make.fun/c/black-friday-deal-finder-01)

**DealHound** is a static deal finder for Black Friday & Cyber Monday 2026: 32 real deals, each with its product, store, store link, sale price, usual price, discount and check time — plus search and filters by category, store and discount, and an honest verdict on every deal.

## What makes a deal "real" here

Every price on the site was read on **27 Nov 2026, ~14:00 WIB** from a deals roundup that names the store (Mashable, Yahoo, Inc., Popular Science, 9to5Google, The Tech Hacker, BeeBulletin, Neeshu, or the store's own Black Friday release). The source is printed on every card. Discounts and dollars saved are computed from those two prices, so they always add up.

Each deal carries a verdict:

- **TRUE DEAL** — a new low or the year's best price
- **STRONG PRICE** — a genuinely good cut
- **ROUTINE SALE** — a small, everyday-style discount
- **CHECK THE FINE PRINT** — the store's "was" price is a comparison value, not a price the item ever sold for; judge the deal by the sale price alone

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

The site is plain static files under `app/` — no build step, no network requests of its own. It works on desktop and on a phone. Filters are shareable: `#q=dyson`, `#cat=Audio`, `#verdict=true`, `#min=50`, `#sort=saved`.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library (`vendor/makefun-frontend.ts`, unchanged from the kit).

## Layout

- `app/index.html` — page shell, controls, method section
- `app/style.css` — all styling (system fonts, no external assets)
- `app/app.js` — wiring: controls, URL hash state, stats bar
- `app/filters.js` — search / filter / sort logic
- `app/render.js` — deal cards and stats (all money math lives here)
- `app/deals.js` — the 32 checked deals and their sources
- `screenshots/` — renders of the site running in a browser
- `main.ts` — the make.fun hand-in program
- `serve.ts` — local preview server

Built for the [Black Friday deal finder bounty](https://make.fun/c/black-friday-deal-finder-01) on make.fun.
