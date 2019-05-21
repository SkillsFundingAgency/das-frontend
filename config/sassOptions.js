"use strict";

let sassOptions;

sassOptions = {
  errLogToConsole: true,
  outputStyle: 'compressed',
  includePaths: [
    'node_modules/govuk-frontend',
    'src/sass',
    'src/sass/libs'
  ]
};

module.exports = sassOptions;