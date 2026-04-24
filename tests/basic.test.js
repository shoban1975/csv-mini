'use strict';

const { parse, stringify, detectDelimiter } = require('../src');

describe('csv-mini parse - happy path', () => {
  test('parses a simple two-row CSV', () => {
    const out = parse('a,b,c\n1,2,3\n');
    expect(out).toEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3'],
    ]);
  });

  test('handles a single row without trailing newline', () => {
    expect(parse('x,y,z')).toEqual([['x', 'y', 'z']]);
  });
});

describe('csv-mini stringify - happy path', () => {
  test('round-trips a simple grid', () => {
    const rows = [
      ['a', 'b'],
      ['1', '2'],
    ];
    expect(stringify(rows)).toBe('a,b\r\n1,2');
  });
});

describe('csv-mini detectDelimiter - happy path', () => {
  test('detects comma in a normal CSV header', () => {
    expect(detectDelimiter('id,name,email\n1,a,b@c')).toBe(',');
  });
});
