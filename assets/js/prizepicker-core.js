export const MIN_CANDIDATE_PROBABILITY = 53.5;

export const THRESHOLDS = Object.freeze({
  Power: Object.freeze({ 2: 57.74, 3: 55.05, 4: 56.23, 5: 54.93, 6: 54.66 }),
  Flex: Object.freeze({ 3: 57.74, 4: 55.04, 5: 54.26, 6: 54.21 }),
});

const SUPPORTED_SPORTS = new Set(['NBA', 'NFL']);

export function americanToImpliedProbability(odds) {
  if (!Number.isFinite(odds) || odds === 0) {
    throw new TypeError('American odds must be a non-zero number.');
  }

  return odds > 0
    ? 100 / (odds + 100)
    : Math.abs(odds) / (Math.abs(odds) + 100);
}

export function removeVig(overOdds, underOdds) {
  const overImplied = americanToImpliedProbability(overOdds);
  const underImplied = americanToImpliedProbability(underOdds);
  const total = overImplied + underImplied;

  return {
    over: overImplied / total,
    under: underImplied / total,
  };
}

function round(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function createCandidate(prop) {
  if (!prop || !Number.isFinite(prop.prizeLine) || !Number.isFinite(prop.sportsbookLine)) {
    throw new TypeError('Simulated prop lines must be finite numbers.');
  }

  const fair = removeVig(prop.overOdds, prop.underOdds);
  const lineDifference = Math.abs(prop.sportsbookLine - prop.prizeLine);
  const fairOverPct = fair.over * 100;
  const fairUnderPct = fair.under * 100;

  if (lineDifference > 0.5) return null;

  const useOver = fairOverPct >= fairUnderPct;
  const fairWinPct = useOver ? fairOverPct : fairUnderPct;
  if (fairWinPct <= MIN_CANDIDATE_PROBABILITY) return null;

  return {
    ...prop,
    lineDifference: round(lineDifference),
    fairOverPct: round(fairOverPct),
    fairUnderPct: round(fairUnderPct),
    betDirection: useOver ? 'OVER' : 'UNDER',
    fairWinPct: round(fairWinPct),
  };
}

function combinations(items, size, start = 0, prefix = [], result = []) {
  if (prefix.length === size) {
    result.push(prefix);
    return result;
  }

  for (let index = start; index <= items.length - (size - prefix.length); index += 1) {
    combinations(items, size, index + 1, [...prefix, items[index]], result);
  }

  return result;
}

function hasUniquePlayers(legs) {
  return new Set(legs.map((leg) => leg.player)).size === legs.length;
}

function hasMultipleTeams(legs) {
  return new Set(legs.map((leg) => leg.team)).size >= 2;
}

function invalidResult(message, error = message) {
  return {
    status: 'error',
    error,
    message,
    thresholdPct: null,
    candidates: [],
    slips: [],
  };
}

export function generateSlips(props, options = {}) {
  if (!Array.isArray(props)) return invalidResult('No simulated props were provided.');

  const config = options && typeof options === 'object' ? options : {};
  const sport = String(config.sport ?? 'NBA').trim().toUpperCase();
  const styleInput = String(config.style ?? 'Power').trim().toLowerCase();
  const style = styleInput ? styleInput[0].toUpperCase() + styleInput.slice(1) : '';
  const size = Number(config.size ?? 2);
  const limit = Number(config.limit ?? 3);

  if (!SUPPORTED_SPORTS.has(sport)) {
    return invalidResult(`Unsupported sport: ${sport || 'blank'}.`, 'Unsupported sport configuration.');
  }

  if (!Number.isInteger(size) || size < 2 || size > 6) {
    return invalidResult('Pick size must be an integer from 2 through 6.', 'Invalid pick size configuration.');
  }

  if (!Number.isInteger(limit) || limit < 1) {
    return invalidResult('Slip limit must be a positive integer.', 'Invalid slip limit configuration.');
  }

  const thresholdPct = THRESHOLDS[style]?.[size];

  if (thresholdPct === undefined) {
    return invalidResult(
      `${style} slips do not support a ${size}-pick size.`,
      `Unsupported ${style} size configuration.`,
    );
  }

  let candidates;
  try {
    candidates = props
      .filter((prop) => String(prop?.sport).toUpperCase() === sport)
      .map(createCandidate)
      .filter(Boolean)
      .sort((a, b) => b.fairWinPct - a.fairWinPct);
  } catch {
    return invalidResult('One or more simulated props are invalid.', 'Invalid simulated prop data.');
  }

  const validSlips = combinations(candidates, size)
    .filter((legs) => hasUniquePlayers(legs) && hasMultipleTeams(legs))
    .map((legs) => {
      const avgWinPct = legs.reduce((sum, leg) => sum + leg.fairWinPct, 0) / legs.length;
      return {
        legs,
        sport,
        style,
        size,
        teams: [...new Set(legs.map((leg) => leg.team))],
        avgWinPct: round(avgWinPct),
        edgePct: round(avgWinPct - thresholdPct),
      };
    })
    .filter((slip) => slip.avgWinPct > thresholdPct)
    .sort((a, b) => b.avgWinPct - a.avgWinPct);

  if (validSlips.length === 0) {
    return {
      status: 'empty',
      message: `No valid ${sport} ${style.toLowerCase()} slips met the sample-data constraints. Try another size or sport.`,
      thresholdPct,
      candidates,
      slips: [],
    };
  }

  const slips = [];
  const usedIds = new Set();
  for (const slip of validSlips) {
    if (slip.legs.some((leg) => usedIds.has(leg.id))) continue;
    slips.push({ ...slip, legs: [...slip.legs] });
    slip.legs.forEach((leg) => usedIds.add(leg.id));
    if (slips.length >= limit) break;
  }

  return {
    status: 'ok',
    message: `${slips.length} simulated slips found from the sample slate.`,
    thresholdPct,
    candidates,
    slips,
  };
}
