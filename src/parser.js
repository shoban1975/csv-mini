'use strict';

// Tiny RFC-4180-ish CSV parser.
// - Delimiter is configurable (default ',').
// - Fields may be wrapped in double quotes; a literal quote inside a quoted
//   field is escaped by doubling it ("").
// - Line terminators inside a quoted field are preserved verbatim.
// - Bare CR, LF, and CRLF outside quotes all terminate a record.
// - A trailing newline at end-of-input does NOT produce a phantom empty record.
// - A leading UTF-8 BOM (U+FEFF) on the very first character is stripped.

function parse(input, options) {
  if (typeof input !== 'string') {
    throw new TypeError('csv-mini: parse() expects a string input');
  }
  const opts = options || {};
  const delimiter = opts.delimiter == null ? ',' : String(opts.delimiter);
  if (delimiter.length !== 1) {
    throw new RangeError('csv-mini: delimiter must be a single character');
  }
  if (delimiter === '"' || delimiter === '\r' || delimiter === '\n') {
    throw new RangeError('csv-mini: delimiter must not be a quote or newline');
  }

  // Strip a leading BOM if present.
  let text = input;
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
  }

  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let i = 0;
  const n = text.length;

  while (i < n) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        // Doubled quote inside a quoted field => literal quote.
        if (i + 1 < n && text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += ch;
      i += 1;
      continue;
    }

    if (ch === '"') {
      // Opening quote only valid at the start of a field.
      if (field.length !== 0) {
        throw new SyntaxError(
          'csv-mini: stray quote in unquoted field at offset ' + i,
        );
      }
      inQuotes = true;
      i += 1;
      continue;
    }

    if (ch === delimiter) {
      row.push(field);
      field = '';
      i += 1;
      continue;
    }

    if (ch === '\r') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      // Swallow a paired LF for CRLF terminators.
      if (i + 1 < n && text[i + 1] === '\n') {
        i += 2;
      } else {
        i += 1;
      }
      continue;
    }

    if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      i += 1;
      continue;
    }

    field += ch;
    i += 1;
  }

  if (inQuotes) {
    throw new SyntaxError('csv-mini: unterminated quoted field');
  }

  // Flush the trailing record only if the input did NOT end with a bare
  // newline -- in that case the newline already pushed the (possibly empty)
  // record and we must not emit a phantom empty row.
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

module.exports = { parse };
