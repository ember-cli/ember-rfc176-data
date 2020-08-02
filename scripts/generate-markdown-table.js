'use strict';

let mappings = require('../mappings');
let helpers = require('./shared');

function code(str) {
  return '`' + str + '`';
}

function pad(str, max) {
  let extra = ' '.repeat(max - str.length);
  return ` ${str}${extra} `;
}

function byGlobal(a, b) {
  return a.global.localeCompare(b.global);
}

function main() {
  let output = [];
  let maxBefore = 0;
  let maxAfter = 0;

  let rows = mappings
    .filter((it) => !it.deprecated)
    .sort(byGlobal)
    .map((mapping) => {
      let before = mapping.global;
      let after = helpers.generateImportForMapping(mapping);

      before = code(before);
      after = code(after);

      maxBefore = Math.max(maxBefore, before.length);
      maxAfter = Math.max(maxAfter, after.length);

      return [before, after];
    });

  // Add headers to beginning of array
  rows.unshift(['---', '---']);
  rows.unshift(['Before', 'After']);

  rows = rows.map(([before, after]) => {
    output.push(`|${pad(before, maxBefore)}|${pad(after, maxAfter)}|`);
  });

  return output.join('\n');
}

if (require.main === module) {
  console.log(main());
} else {
  module.exports = main;
}
