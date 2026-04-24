'use strict';

// Heuristic delimiter detector.  Counts occurrences of each candidate
// delimiter in the FIRST non-quoted line of the input; the candidate with the
// highest non-zero count wins.  Ties are broken by the order in `candidates`.
// Quoted regions are skipped so that delimiters inside quoted fields do not
// inflate the count.

function detectDelimiter(input, candidates) {
  if (typeof input !== 'string') {
    throw new TypeError('csv-mini: detectDelimiter() expects a string');
  }
  const cands =
    candidates && candidates.length ? candidates : [',', ';', '\t', '|'];

  // Scan the first logical line, skipping quoted regions.
  const counts = new Map();
  for (let k = 0; k < cands.length; k += 1) counts.set(cands[k], 0);

  let inQuotes = false;
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < input.length && input[i + 1] === '"') {
          i += 1;
          continue;
        }
        inQuotes = false;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === '\n' || ch === '\r') break;
    if (counts.has(ch)) counts.set(ch, counts.get(ch) + 1);
  }

  let best = null;
  let bestCount = 0;
  for (let k = 0; k < cands.length; k += 1) {
    const c = cands[k];
    const n = counts.get(c) || 0;
    if (n > bestCount) {
      best = c;
      bestCount = n;
    }
  }
  return best; // null if no candidate appeared on the first line.
}

module.exports = { detectDelimiter };
