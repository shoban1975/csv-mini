'use strict';

// Tiny RFC-4180-ish CSV writer.
// - Quotes a field iff it contains the delimiter, a quote, CR, or LF.
// - Embedded quotes are escaped by doubling them.
// - Records are joined with CRLF by default (RFC 4180 line terminator).

function needsQuoting(field, delimiter) {
  for (let i = 0; i < field.length; i += 1) {
    const ch = field[i];
    if (ch === delimiter || ch === '"' || ch === '\r' || ch === '\n') {
      return true;
    }
  }
  return false;
}

function quoteField(field) {
  return '"' + field.replace(/"/g, '""') + '"';
}

function stringify(rows, options) {
  if (!Array.isArray(rows)) {
    throw new TypeError('csv-mini: stringify() expects an array of rows');
  }
  const opts = options || {};
  const delimiter = opts.delimiter == null ? ',' : String(opts.delimiter);
  if (delimiter.length !== 1) {
    throw new RangeError('csv-mini: delimiter must be a single character');
  }
  const eol = opts.eol == null ? '\r\n' : String(opts.eol);

  const out = [];
  for (let r = 0; r < rows.length; r += 1) {
    const row = rows[r];
    if (!Array.isArray(row)) {
      throw new TypeError(
        'csv-mini: stringify() expects each row to be an array',
      );
    }
    const fields = [];
    for (let c = 0; c < row.length; c += 1) {
      const v = row[c];
      // Coerce non-string values to strings.  null and undefined become "".
      const s = v == null ? '' : String(v);
      fields.push(needsQuoting(s, delimiter) ? quoteField(s) : s);
    }
    out.push(fields.join(delimiter));
  }
  return out.join(eol);
}

module.exports = { stringify };
