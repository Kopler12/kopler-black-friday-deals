// DealHound app wiring — one job: read the filter controls and the URL
// hash, re-render the grid, and keep the two in sync so a filtered view
// can be shared as a link (e.g. #q=dyson or #verdict=true).

import { DEALS } from './deals.js';
import { applyFilters, distinctValues } from './filters.js';
import { dealCard, money, statsLine } from './render.js';

const grid = document.getElementById('grid');
const countEl = document.getElementById('count');
const searchEl = document.getElementById('search');
const categoryEl = document.getElementById('category');
const storeEl = document.getElementById('store');
const discountEl = document.getElementById('discount');
const sortEl = document.getElementById('sort');
const verdictEl = document.getElementById('verdict-only');

function fillSelect(select, values, allLabel) {
  select.innerHTML = `<option value="All">${allLabel}</option>` +
    values.map((v) => `<option value="${v}">${v}</option>`).join('');
}

fillSelect(categoryEl, distinctValues(DEALS, 'category'), 'All categories');
fillSelect(storeEl, distinctValues(DEALS, 'store'), 'All stores');

function readState() {
  return {
    q: searchEl.value,
    category: categoryEl.value,
    store: storeEl.value,
    minDiscount: Number(discountEl.value) || 0,
    verdictOnly: verdictEl.checked,
    sort: sortEl.value,
  };
}

function render() {
  const shown = applyFilters(DEALS, readState());
  grid.innerHTML = shown.length
    ? shown.map(dealCard).join('')
    : '<p class="empty">No deals match those filters. Try clearing the search or lowering the discount.</p>';
  countEl.textContent = `Showing ${shown.length} of ${DEALS.length} deals`;
  writeHash(readState());
}

function writeHash(state) {
  const params = new URLSearchParams();
  if (state.q.trim()) params.set('q', state.q.trim());
  if (state.category !== 'All') params.set('cat', state.category);
  if (state.store !== 'All') params.set('store', state.store);
  if (state.minDiscount) params.set('min', String(state.minDiscount));
  if (state.verdictOnly) params.set('verdict', 'true');
  if (state.sort !== 'verdict') params.set('sort', state.sort);
  const hash = params.toString();
  history.replaceState(null, '', hash ? `#${hash}` : '#');
}

function readHash() {
  const params = new URLSearchParams(location.hash.slice(1));
  if (params.get('q')) searchEl.value = params.get('q');
  if (params.get('cat')) categoryEl.value = params.get('cat');
  if (params.get('store')) storeEl.value = params.get('store');
  if (params.get('min')) discountEl.value = params.get('min');
  if (params.get('verdict') === 'true') verdictEl.checked = true;
  if (params.get('sort')) sortEl.value = params.get('sort');
}

for (const el of [searchEl, categoryEl, storeEl, discountEl, sortEl, verdictEl]) {
  el.addEventListener('input', render);
}

const stats = statsLine(DEALS);
document.getElementById('stat-deals').textContent = String(stats.total);
document.getElementById('stat-true').textContent = String(stats.trueCount);
document.getElementById('stat-saved').textContent = money(stats.totalSaved);
document.getElementById('stat-biggest').textContent = `-${stats.biggest}%`;

readHash();
render();
