const fs = require('fs');
const mappings = require('../mappings');
const { compare } = require('./shared');

function sortByModuleAndExport(mappingA, mappingB) {
  if (mappingA.module === mappingB.module) {
    // ensure default exports sort higher within a package
    let aExport = mappingA.export === 'default' ? '' : mappingA.export;
    let bExport = mappingB.export === 'default' ? '' : mappingB.export;
    return compare(aExport || '', bExport || '');
  }

  return compare(mappingA.module, mappingB.module);
}

let sorted = mappings.sort(sortByModuleAndExport);
fs.writeFileSync('mappings.json', JSON.stringify(sorted, null, 2), {
  encoding: 'utf-8',
});
