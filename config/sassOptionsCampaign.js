let sassOptionsCampaign;

sassOptionsCampaign = {
  errLogToConsole: true,
  outputStyle: 'compressed',
  includePaths: [
    'node_modules/govuk_template_mustache/source/assets/stylesheets',
    'node_modules/govuk_frontend_toolkit/stylesheets',
    'node_modules/govuk-elements-sass/public/sass',
    'node_modules/govuk-frontend',
    'node_modules/plyr/src/sass',
    'src/sass'
  ],
};

module.exports = sassOptionsCampaign;