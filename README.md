# csv-mini

> Tiny zero-dependency CSV parser and writer with RFC-4180-ish semantics.

A pragmatic ~250-LOC CSV toolkit for small-to-medium data files. Three
modules, one test runner, no transitive dependencies.

## API

```js
const { parse, stringify, detectDelimiter } = require('csv-mini');

const rows = parse('a,b,c\n1,2,3\n');
// => [['a','b','c'], ['1','2','3']]

const out = stringify([['x', 'y'], ['1', '"2"']]);
// => 'x,y\r\n1,"""2"""'

const d = detectDelimiter('id;name;email\n1;a;b@c');
// => ';'
```

### `parse(input, { delimiter = ',' }) -> string[][]`

- Wraps fields in `"..."`; double quotes inside a quoted field are escaped
  by doubling them (`""`).
- Accepts CR, LF, or CRLF as line terminators.
- A trailing newline does not produce a phantom empty row.
- A leading UTF-8 BOM is stripped.

### `stringify(rows, { delimiter = ',', eol = '\r\n' }) -> string`

- Quotes a field only when it contains the delimiter, a quote, or a newline.
- Coerces `null` and `undefined` to the empty string.

### `detectDelimiter(input, candidates = [',', ';', '\t', '|']) -> string | null`

- Scans the first non-quoted line and returns the most common candidate.
- Returns `null` when no candidate appears.

## Tests

```sh
npm install
npm test
```

The current test suite covers a few happy-path cases per module.  Edge cases
(quoted fields with embedded delimiters, CRLF, BOM, malformed input,
empty/zero-arity rows, error messages) are not yet covered and would benefit
from additional jest cases.

## License

MIT (c) shoban1975
