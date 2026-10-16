import { SIMULATED_PROPS } from '../data/prizepicker-odds.js?v=20261016-six-leg';
import { generateSlips } from './prizepicker-core.js?v=20261016-six-leg';

const DEFAULTS = Object.freeze({ sport: 'NBA', style: 'Power', size: '2' });

function formatPercent(value) {
  return `${Number(value).toFixed(2)}%`;
}

function formatAmericanOdds(value) {
  return value > 0 ? `+${value}` : `${value}`;
}

function renderSlip(slip, index) {
  const legs = slip.legs.map((leg) => {
    const selectedOdds = leg.betDirection === 'OVER' ? leg.overOdds : leg.underOdds;
    return `
    <li class="simulator-leg">
      <div>
        <strong>${leg.player}</strong>
        <span>${leg.team} · ${leg.market} · ${leg.betDirection} ${leg.prizeLine} · simulated odds ${formatAmericanOdds(selectedOdds)}</span>
      </div>
      <span class="simulator-leg-probability">${formatPercent(leg.fairWinPct)}</span>
    </li>
    `;
  }).join('');

  return `
    <article class="simulator-slip">
      <div class="simulator-slip-header">
        <div>
          <small>SIMULATED SLIP ${index + 1}</small>
          <h3>${slip.size}-pick ${slip.sport} ${slip.style} play</h3>
        </div>
        <div class="simulator-slip-stat">
          <span>Average fair chance</span>
          <strong>${formatPercent(slip.avgWinPct)}</strong>
        </div>
      </div>
      <ul class="simulator-legs">${legs}</ul>
      <div class="simulator-slip-footer">
        <span>Edge over sample threshold</span>
        <strong>${slip.edgePct >= 0 ? '+' : ''}${formatPercent(slip.edgePct)}</strong>
      </div>
    </article>
  `;
}

function renderEmpty(message) {
  return `
    <div class="simulator-empty">
      <small>NO QUALIFYING SLIPS</small>
      <h3>That combination came up empty.</h3>
      <p>${message}</p>
    </div>
  `;
}

function updateSizeOptions(styleSelect, sizeSelect) {
  const isFlex = styleSelect.value === 'Flex';
  const twoPickOption = sizeSelect.querySelector('option[value="2"]');
  twoPickOption.disabled = isFlex;
  if (isFlex && sizeSelect.value === '2') sizeSelect.value = '3';
}

function renderInitial(status, results) {
  status.textContent = 'Ready to analyze the simulated sample slate.';
  results.innerHTML = '';
}

export function initPrizePickerSimulator(root) {
  if (!root) return;

  const form = root.querySelector('#prizepicker-simulator');
  const sportSelect = root.querySelector('#simulator-sport');
  const styleSelect = root.querySelector('#simulator-style');
  const sizeSelect = root.querySelector('#simulator-size');
  const resetButton = root.querySelector('#simulator-reset');
  const status = root.querySelector('#simulator-status');
  const results = root.querySelector('#simulator-results');

  if (!form || !sportSelect || !styleSelect || !sizeSelect || !resetButton || !status || !results) return;

  const analyze = () => {
    const result = generateSlips(SIMULATED_PROPS, {
      sport: sportSelect.value,
      style: styleSelect.value,
      size: sizeSelect.value,
      limit: 3,
    });

    status.textContent = result.message;
    results.innerHTML = result.status === 'ok'
      ? result.slips.map(renderSlip).join('')
      : renderEmpty(result.message);
  };

  sportSelect.value = DEFAULTS.sport;
  styleSelect.value = DEFAULTS.style;
  sizeSelect.value = DEFAULTS.size;
  updateSizeOptions(styleSelect, sizeSelect);
  renderInitial(status, results);

  styleSelect.addEventListener('change', () => updateSizeOptions(styleSelect, sizeSelect));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    analyze();
  });
  resetButton.addEventListener('click', () => {
    form.reset();
    sportSelect.value = DEFAULTS.sport;
    styleSelect.value = DEFAULTS.style;
    sizeSelect.value = DEFAULTS.size;
    updateSizeOptions(styleSelect, sizeSelect);
    renderInitial(status, results);
  });
}

const simulatorRoot = document.querySelector('#simulator-root');
if (simulatorRoot) initPrizePickerSimulator(simulatorRoot);
