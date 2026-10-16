// @vitest-environment jsdom

import { beforeEach, describe, expect, test } from 'vitest';

import { initPrizePickerSimulator } from '../assets/js/prizepicker-simulator.js';

const simulatorMarkup = `
  <section id="simulator-root">
    <form id="prizepicker-simulator">
      <select id="simulator-sport" name="sport">
        <option value="NBA">NBA</option>
        <option value="NFL">NFL</option>
      </select>
      <select id="simulator-style" name="style">
        <option value="Power">Power</option>
        <option value="Flex">Flex</option>
      </select>
      <select id="simulator-size" name="size">
        <option value="2">2 picks</option>
        <option value="3">3 picks</option>
        <option value="4">4 picks</option>
        <option value="5">5 picks</option>
        <option value="6">6 picks</option>
      </select>
      <button id="simulator-submit" type="submit">Analyze</button>
      <button id="simulator-reset" type="button">Reset</button>
    </form>
    <p id="simulator-status" role="status" aria-live="polite"></p>
    <div id="simulator-results"></div>
  </section>
`;

beforeEach(() => {
  document.body.innerHTML = simulatorMarkup;
  initPrizePickerSimulator(document.querySelector('#simulator-root'));
});

describe('PrizePicker simulator UI', () => {
  test('renders ranked slips after a normal submission', () => {
    document.querySelector('#prizepicker-simulator').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );

    expect(document.querySelector('#simulator-results').textContent).toContain('Shéyaa Bin Abraham-Joseph');
    expect(document.querySelector('#simulator-results').textContent).toMatch(/simulated odds/i);
    expect(document.querySelector('#simulator-status').textContent).toMatch(/simulated slips found/i);
  });

  test('disables two-pick Flex mode and announces an empty result', () => {
    const style = document.querySelector('#simulator-style');
    const size = document.querySelector('#simulator-size');
    style.value = 'Flex';
    style.dispatchEvent(new Event('change', { bubbles: true }));

    expect(size.querySelector('option[value="2"]').disabled).toBe(true);
    expect(size.value).toBe('3');

    document.querySelector('#simulator-sport').value = 'NFL';
    size.value = '6';
    document.querySelector('#prizepicker-simulator').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );

    expect(document.querySelector('#simulator-results').textContent).toMatch(/no valid/i);
    expect(document.querySelector('#simulator-status').textContent).toMatch(/no valid/i);
  });

  test('reset clears results and restores the default controls', () => {
    document.querySelector('#prizepicker-simulator').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    document.querySelector('#simulator-style').value = 'Flex';
    document.querySelector('#simulator-style').dispatchEvent(new Event('change', { bubbles: true }));
    document.querySelector('#simulator-reset').click();

    expect(document.querySelector('#simulator-style').value).toBe('Power');
    expect(document.querySelector('#simulator-size').value).toBe('2');
    expect(document.querySelector('#simulator-results').textContent).toBe('');
    expect(document.querySelector('#simulator-status').textContent).toMatch(/ready/i);
  });
});
