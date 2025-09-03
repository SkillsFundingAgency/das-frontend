"use strict";

let sassOptions;

sassOptions = {
  style: 'compressed',
  loadPaths: ['./node_modules'],
  silenceDeprecations: ['legacy-js-api', 'function-units', 'mixed-decls', 'slash-div', 'global-builtin', 'import', 'color-functions'],
};

module.exports = sassOptions;
