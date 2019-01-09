"use strict";
const gulp = require('gulp');

require('./tasks/gulp/default')
require('./tasks/gulp/legacy')
require('./tasks/gulp/campaign')
require('./tasks/gulp/dasJs')

gulp.task('legacy',   ['copy-legacy-template-assets', 'js-legacy', 'sass-legacy']);
gulp.task('default',  ['copy-assets', 'copy-js', 'sass', 'watch']);
gulp.task('campaign', ['sass-campaign', 'watch-campaign', 'js-campaign','image-campaign', 'copy-plyr-js']);
