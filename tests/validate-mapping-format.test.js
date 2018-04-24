const mappings = require('../mappings.json');

for (let mapping of mappings) {
  describe('Validate mapping format', () => {
    test(`${mapping.global} - ${mapping.module} - ${mapping.export}`, () => {
      expect(mapping.global).toMatch(/.+/);
      expect(mapping.module).toMatch(/.+/);
      expect(mapping.export).toMatch(/.+/);
      expect([true, false]).toContain(mapping.deprecated);
    });
  });
}
