// DealHound filtering and sorting — one job: turn the deal list and the
// current filter state into the ordered list the page shows.

export const VERDICT_ORDER = { true: 0, strong: 1, check: 2, routine: 3 };

export function discountPct(deal) {
  return Math.round(((deal.was - deal.sale) / deal.was) * 100);
}

export function savedDollars(deal) {
  return Math.round((deal.was - deal.sale) * 100) / 100;
}

// state: { q, category, store, minDiscount, verdictOnly, sort }
export function applyFilters(deals, state) {
  const q = (state.q || '').trim().toLowerCase();
  let out = deals.filter((deal) => {
    if (state.category && state.category !== 'All' && deal.category !== state.category) return false;
    if (state.store && state.store !== 'All' && deal.store !== state.store) return false;
    if (state.minDiscount && discountPct(deal) < state.minDiscount) return false;
    if (state.verdictOnly && deal.verdict !== 'true') return false;
    if (q) {
      const hay = `${deal.name} ${deal.store} ${deal.category} ${deal.source}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  switch (state.sort) {
    case 'discount':
      out = [...out].sort((a, b) => discountPct(b) - discountPct(a) || a.sale - b.sale);
      break;
    case 'saved':
      out = [...out].sort((a, b) => savedDollars(b) - savedDollars(a));
      break;
    case 'price':
      out = [...out].sort((a, b) => a.sale - b.sale);
      break;
    case 'verdict':
    default:
      out = [...out].sort(
        (a, b) =>
          VERDICT_ORDER[a.verdict] - VERDICT_ORDER[b.verdict] ||
          discountPct(b) - discountPct(a),
      );
      break;
  }
  return out;
}

export function distinctValues(deals, key) {
  return [...new Set(deals.map((deal) => deal[key]))].sort();
}
