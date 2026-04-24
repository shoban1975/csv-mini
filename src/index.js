'use strict';

const { parse } = require('./parser');
const { stringify } = require('./writer');
const { detectDelimiter } = require('./detect');

module.exports = { parse, stringify, detectDelimiter };
