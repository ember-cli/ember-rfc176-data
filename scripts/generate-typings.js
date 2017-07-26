#!/usr/bin/env node

const chalk = require("chalk");
const green = chalk.green;
const blue = chalk.blue;
const mapping = require("../globals");
const reserved = require("../reserved");

function normalize(key) {
  let row = mapping[key];

  return {
    before: key,
    row: row,
    group: row[0]
  }
}

function sortByGroup(a, b) {
  return (a.group < b.group) ? -1 :
    ((a.group > b.group) ? 1 :
      0);
}

function tableRow(before, row) {
  let [afterPackage, afterExportName, afterIdentifier] = row;

  // For default exports, assume the identifier remains the same as the global
  // version if an explicit name isn't provided.
  if (!afterIdentifier) {
    afterIdentifier = before;
  }

  // Object, Array, etc.
  if (reserved.includes(afterIdentifier)) {
    afterIdentifier = "Ember" + afterIdentifier;
  }

  return [afterIdentifier, afterPackage, afterExportName];
}

function buildTable(result, row) {
  let group = result[row.group] = result[row.group] || {
    rows: []
  };

  let [afterIdentifier, afterPackage, afterExportName] = tableRow(row.before, row.row);

  return group.rows.push([afterIdentifier, afterPackage, afterExportName, row.row]), result;
}

function cmp(a, b) {
  return (a > b) ? 1 : (a < b) ? -1 : 0;
}

function sortByPackageAndExport([, , , a], [, , , b]) {
  if (a[0] === b[0]) {
    return cmp(a[1] || "", b[1] || "");
  }

  return cmp(a[0], b[0]);
}

function printTable(table) {
  Object.keys(table).map(name => {
    print("declare module \"" + name + "\" {");

    let group = table[name];
    let rows = group.rows;

    rows = rows.sort(sortByPackageAndExport);

    rows.map(([afterIdentifier, afterPackage, afterExportName], i) => {
      if (afterExportName) {
        print("  export function " + afterExportName + "() {\n  }");
      } else {
        print("  export class " + afterIdentifier + " {\n  }");
      }
      if (i !== rows.length - 1) {
        print();
      }
    });

    print('}');
    print();
  });
}

function print() {
  console.log.apply(console, arguments);
}

let table = Object.keys(mapping)
  .map(normalize)
  .sort(sortByGroup)
  .reduce(buildTable, {});

printTable(table);
