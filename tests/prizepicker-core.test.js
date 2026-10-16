import { describe, expect, test } from 'vitest';

import { SIMULATED_PROPS } from '../assets/data/prizepicker-odds.js';
import {
  americanToImpliedProbability,
  generateSlips,
  removeVig,
} from '../assets/js/prizepicker-core.js';

describe('PrizePicker probability helpers', () => {
  test('converts positive and negative American odds to implied probability', () => {
    expect(americanToImpliedProbability(150)).toBeCloseTo(0.4, 5);
    expect(americanToImpliedProbability(-150)).toBeCloseTo(0.6, 5);
  });

  test('removes vig so the two fair probabilities sum to one', () => {
    const fair = removeVig(-150, 130);

    expect(fair.over).toBeGreaterThan(0.5);
    expect(fair.over + fair.under).toBeCloseTo(1, 10);
  });
});

describe('PrizePicker slip analyzer', () => {
  test('returns the strongest valid default simulated power slip', () => {
    const result = generateSlips(SIMULATED_PROPS, {
      sport: 'NBA',
      style: 'Power',
      size: 2,
      limit: 3,
    });

    expect(result.status).toBe('ok');
    expect(result.thresholdPct).toBe(57.74);
    expect(result.slips[0].style).toBe('Power');
    expect(result.slips[0].legs.map((leg) => leg.player)).toEqual([
      'Shéyaa Bin Abraham-Joseph',
      'Jordan Terrell Carter',
    ]);
    expect(result.slips[0].teams).toHaveLength(2);
  });

  test('returns a valid six-pick NBA power slip with unique players', () => {
    const result = generateSlips(SIMULATED_PROPS, {
      sport: 'NBA',
      style: 'Power',
      size: 6,
      limit: 1,
    });

    expect(result.status).toBe('ok');
    expect(result.slips[0].legs).toHaveLength(6);
    expect(new Set(result.slips[0].legs.map((leg) => leg.player)).size).toBe(6);
    expect(new Set(result.slips[0].legs.map((leg) => leg.team)).size).toBeGreaterThanOrEqual(2);
  });

  test('rejects props whose sportsbook and PrizePicks lines differ by more than 0.5', () => {
    const result = generateSlips(SIMULATED_PROPS, {
      sport: 'NBA',
      style: 'Power',
      size: 2,
    });

    expect(result.candidates.some((candidate) => candidate.id === 'nba-line-mismatch')).toBe(false);
  });

  test('enforces unique players and at least two teams in a slip', () => {
    const result = generateSlips(SIMULATED_PROPS, {
      sport: 'NBA',
      style: 'Power',
      size: 2,
      limit: 10,
    });

    result.slips.forEach((slip) => {
      expect(new Set(slip.legs.map((leg) => leg.player)).size).toBe(slip.legs.length);
      expect(new Set(slip.legs.map((leg) => leg.team)).size).toBeGreaterThanOrEqual(2);
    });
  });

  test('returns an explicit error for unsupported Flex two-pick configuration', () => {
    const result = generateSlips(SIMULATED_PROPS, {
      sport: 'NBA',
      style: 'Flex',
      size: 2,
    });

    expect(result.status).toBe('error');
    expect(result.error).toMatch(/size/i);
    expect(result.slips).toEqual([]);
  });

  test('returns an empty result when no valid slip can meet the constraints', () => {
    const result = generateSlips(SIMULATED_PROPS, {
      sport: 'NFL',
      style: 'Flex',
      size: 6,
    });

    expect(result.status).toBe('empty');
    expect(result.slips).toEqual([]);
    expect(result.message).toMatch(/no valid/i);
  });

  test('returns a structured error for unsupported options or malformed props', () => {
    expect(generateSlips(SIMULATED_PROPS, { sport: 'MLB', style: 'Power', size: 2 }).status).toBe('error');
    expect(generateSlips(SIMULATED_PROPS, { sport: 'NBA', style: 'Power', size: 0 }).status).toBe('error');
    expect(() => generateSlips([{ ...SIMULATED_PROPS[0], overOdds: 0 }], {
      sport: 'NBA',
      style: 'Power',
      size: 2,
    })).not.toThrow();
    expect(generateSlips([{ ...SIMULATED_PROPS[0], overOdds: 0 }], {
      sport: 'NBA',
      style: 'Power',
      size: 2,
    }).status).toBe('error');
  });
});
