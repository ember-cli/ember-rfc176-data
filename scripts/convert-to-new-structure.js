let globals = require('../globals.json');
let oldShims = require('../old-shims.json');

let mappings = [];

Object.keys(globals).forEach(key => {
  let value = globals[key];

  let global = `Ember.${key}`;
  let module = value[0];
  let exportName = value[1] || 'default';
  let localName = value[1] ? undefined : (value[2] || key);

  mappings.push({ global, module, export: exportName, localName, deprecated: false });
});

Object.keys(oldShims).forEach(module => {
  let _value = oldShims[module];

  Object.keys(_value).forEach(exportName => {
    let value = _value[exportName];
    if (!value) return;

    let mapping = mappings.find(it => it.module === value[0] && it.export === (value[1] || 'default'));

    let replacement = { module: mapping.module, export: mapping.export };

    mappings.push({ global: mapping.global, module, export: exportName, deprecated: true, replacement });
  })
});

console.log(JSON.stringify(mappings, null, 2));
