"use strict";

let sassOptions;

sassOptions = {
  errLogToConsole: true,
  outputStyle: 'compressed',
  includePaths: [
    'node_modules/govuk-frontend/dist/govuk',
    'src/sass',
    'src/sass/libs'
  ]
};

module.exports = sassOptions;