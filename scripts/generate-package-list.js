'use strict';

const chalk = require('chalk');
const green = chalk.green;
const blue = chalk.blue;
const mappings = require('../mappings');

function unique(v, i, a) {
  return a.indexOf(v) === i;
}

function print(value) {
  console.log(value);
}

function indent(value) {
  let level = value.split('/').length - 1;
  let color = level > 0 ? blue : green;
  return '  '.repeat(level) + color(value);
}

let table = mappings
  .filter(mapping => !mapping.deprecated)
  .map(mapping => mapping.module)
  .filter(unique)
  .map(key => indent(key))
  .forEach(print);
