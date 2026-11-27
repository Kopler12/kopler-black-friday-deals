// DealHound card rendering — one job: turn one deal into its card HTML
// and the stats bar numbers. All money math lives here so the numbers on
// every card always add up: discount % and dollars saved are computed from
// the deal's own sale and usual prices, never typed in by hand.

import { discountPct, savedDollars } from './filters.js';
import { CHECKED_LABEL } from './deals.js';

export const VERDICT_LABELS = {
  true: 'TRUE DEAL',
  strong: 'STRONG PRICE',
  routine: 'ROUTINE SALE',
  check: 'CHECK THE FINE PRINT',
};

export function money(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function dealCard(deal) {
  const pct = discountPct(deal);
  const saved = savedDollars(deal);
  return `<article class="card verdict-${deal.verdict}" data-id="${deal.id}">
  <div class="card-top">
    <span class="badge badge-${deal.verdict}">${VERDICT_LABELS[deal.verdict]}</span>
    <span class="store">${deal.store}</span>
  </div>
  <h3 class="name">${deal.name}</h3>
  <p class="cat">${deal.category}</p>
  <div class="prices">
    <span class="sale">${money(deal.sale)}</span>
    <span class="was">${money(deal.was)}</span>
    <span class="pct">-${pct}%</span>
  </div>
  <p class="saved">You save ${money(saved)}</p>
  <p class="note">${deal.note}</p>
  <a class="cta" href="${deal.url}" target="_blank" rel="noopener">View at ${deal.store} &rarr;</a>
  <p class="meta">${CHECKED_LABEL}<br>Source: ${deal.source}</p>
</article>`;
}

export function statsLine(deals) {
  const trueCount = deals.filter((d) => d.verdict === 'true').length;
  const totalSaved = deals.reduce((sum, d) => sum + savedDollars(d), 0);
  const biggest = Math.max(...deals.map((d) => discountPct(d)));
  return { total: deals.length, trueCount, totalSaved, biggest };
}
