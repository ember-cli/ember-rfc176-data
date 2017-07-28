const globals = require('../globals.json');

test('All default exports are not nested or have an alternative local name defined', () => {
  for (let global of Object.keys(globals)) {
    let mapping = globals[global];
    let isDefaultExport = mapping.length < 2 || mapping[1] === null;
    if (!isDefaultExport) continue;

    let hasAlternativeLocalName = mapping.length === 3 && Boolean(mapping[2]);
    if (hasAlternativeLocalName) continue;

    expect(global).not.toContain('.');
  }
});
