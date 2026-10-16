import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const prizePickerPage = readFileSync(new URL('../prizepicker/index.html', import.meta.url), 'utf8');

describe('PrizePicker page structure', () => {
  test('exposes the simulator controls and module entrypoint', () => {
    expect(prizePickerPage).toContain('id="simulator-root"');
    expect(prizePickerPage).toContain('id="simulator-sport"');
    expect(prizePickerPage).toContain('id="simulator-style"');
    expect(prizePickerPage).toContain('id="simulator-size"');
    expect(prizePickerPage).toContain('src="../assets/js/prizepicker-simulator.js"');
  });

  test('labels the simulator as educational simulated data', () => {
    expect(prizePickerPage).toMatch(/simulated sample data/i);
    expect(prizePickerPage).toMatch(/not live odds|not betting advice/i);
  });
});
