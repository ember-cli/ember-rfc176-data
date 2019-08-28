const fs = require('fs');
const generateGlobalToModuleXref = require('./generate-markdown-table');
const generateModuleByModuleXref = require('./generate-by-module-markdown-table');

function updateREADME() {
  let originalContents = fs.readFileSync('README.md', 'utf8');

  let updatedContents = originalContents.replace(
    /<!-- MODULE_TO_GLOBAL_CROSS_REFERENCE_START -->[\s\S]*<!-- MODULE_TO_GLOBAL_CROSS_REFERENCE_END -->/,
    // using replacement function here because our output includes $` which is a special replacement value
    // in String.prototype.replace, using a function avoids that pitfall
    () => {
      return `<!-- MODULE_TO_GLOBAL_CROSS_REFERENCE_START -->\n\n${generateGlobalToModuleXref()}\n\n<!-- MODULE_TO_GLOBAL_CROSS_REFERENCE_END -->`;
    }
  );

  let finalContents = updatedContents.replace(
    /<!-- MODULE_BY_MODULE_LISTING_START -->[\s\S]*<!-- MODULE_BY_MODULE_LISTING_END -->/m,
    // using replacement function here because our output includes $` which is a special replacement value
    // in String.prototype.replace, using a function avoids that pitfall
    () => {
      return `<!-- MODULE_BY_MODULE_LISTING_START -->\n\n${generateModuleByModuleXref()}\n\n<!-- MODULE_BY_MODULE_LISTING_END -->`;
    }
  );

  fs.writeFileSync('README.md', finalContents, 'utf8');
}

if (require.main === module) {
  updateREADME();
}
