'use strict';

const mappings = require('../mappings');
const { compare, generateImportForMapping } = require('./shared');

function normalize(mapping) {
  return {
    mapping,
    group: mapping.module.split('/', 2).join('/'),
  };
}

function sortByGroup(a, b) {
  return compare(a.group, b.group);
}

function tableRow(mapping) {
  let before = mapping.global;
  let after = generateImportForMapping(mapping);

  before = code(before);
  after = code(after);

  return [before, after];
}

function buildTable(result, row) {
  let group = (result[row.group] = result[row.group] || {
    maxBefore: 0,
    maxAfter: 0,
    rows: [],
  });

  let [before, after] = tableRow(row.mapping);

  group.maxBefore = Math.max(group.maxBefore, before.length);
  group.maxAfter = Math.max(group.maxAfter, after.length);

  group.rows.push([before, after, row.mapping]);

  return result;
}

function sortByPackageAndExport([, , mappingA], [, , mappingB]) {
  if (mappingA.module === mappingB.module) {
    // ensure default exports sort higher within a package
    let aExport = mappingA.export === 'default' ? '' : mappingA.export;
    let bExport = mappingB.export === 'default' ? '' : mappingB.export;
    return compare(aExport || '', bExport || '');
  }

  return compare(mappingA.module, mappingB.module);
}

function printTable(table) {
  Object.keys(table).map(name => {
    print('#### ' + code(name));

    let group = table[name];
    let rows = group.rows;

    rows = rows.sort(sortByPackageAndExport);

    rows.unshift(['---', '---']);
    rows.unshift(['Global', 'Module']);
    rows.map(([before, after]) => {
      print(`|${pad(after, group.maxAfter)}|${pad(before, group.maxBefore)}|`);
    });

    print();
  });
}

function code(str) {
  return '`' + str + '`';
}

function pad(str, max) {
  let extra = ' '.repeat(max - str.length);
  return ` ${str}${extra} `;
}

function print() {
  console.log.apply(console, arguments);
}

let table = mappings
  .filter(mapping => !mapping.deprecated)
  .map(normalize)
  .sort(sortByGroup)
  .reduce(buildTable, {});

printTable(table);
