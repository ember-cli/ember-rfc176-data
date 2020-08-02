const fs = require('fs');
const mappings = require('../mappings');
const reserved = require('../reserved');
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

let updated = mappings.sort(sortByModuleAndExport).map((mapping) => {
  let localName = mapping.localName || mapping.export;

  // ensure localName is set when a reserved word collides
  if (reserved.includes(localName)) {
    localName = 'Ember' + localName;
  }

  // remove localName when it matches export
  if (localName === mapping.export) {
    localName = undefined;
  }

  // return a new object so that all of the properties in the JSON
  // are in the same order
  let ret = {
    global: mapping.global,
    module: mapping.module,
    export: mapping.export,
    localName,
    deprecated: !!mapping.deprecated,
    replacement: mapping.replacement,
  };

  return ret;
});

fs.writeFileSync('mappings.json', JSON.stringify(updated, null, 2) + '\n', {
  encoding: 'utf-8',
});
