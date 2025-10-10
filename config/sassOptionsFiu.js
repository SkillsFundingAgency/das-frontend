let sassOptionsFiu;

sassOptionsFiu = {
  errLogToConsole: true,
  silenceDeprecations: [
    'legacy-js-api',
    'function-units',
    'mixed-decls',
    'slash-div',
    'global-builtin',
    'import',
    'color-functions',
  ],
  outputStyle: 'compressed',
  includePaths: ['node_modules/govuk-frontend/dist', 'node_modules/plyr/src/sass', 'src/sass'],
};

module.exports = sassOptionsFiu;
