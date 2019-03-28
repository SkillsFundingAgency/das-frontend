let sassOptions;

sassOptions = {
  errLogToConsole: true,
  outputStyle: 'compressed',
  includePaths: [
    'node_modules/govuk-frontend',
    'node_modules/accessible-autocomplete/src',
    'src/sass'
  ],
};

module.exports = sassOptions;