'use strict';

const mappings = require('../mappings.json');

describe('All default exports have a local name defined', () => {
  for (let mapping of mappings) {
    if (mapping.export === 'default' && !mapping.deprecated) {
      test(mapping.module, () => {
        expect(mapping.localName).toBeTruthy();
      });
    }
  }
});
