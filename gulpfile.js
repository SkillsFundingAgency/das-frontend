"use strict";

const gulp = require('gulp');

require('./tasks/gulp/das');
require('./tasks/gulp/campaign');
require('./tasks/gulp/fiu');
require('./tasks/gulp/dasJs');

const defaultBuildTasks = gulp.series('das-copy-libs', 'das-copy-images', 'das-compile-sass', 'das-compile-js', 'das-compile-js-components', 'das-compile-js-components-dev');
const defaultWatchTasks = gulp.parallel('das-watch-sass', 'das-watch-js');

const campaignBuildTasks = gulp.series('campaign-copy-libs', 'campaign-compile-sass', 'campaign-compile-js', 'campaign-copy-images');
const campaignWatchTasks = gulp.parallel('campaign-watch-sass');

const fiuBuildTasks = gulp.series('fiu-copy-libs', 'fiu-compile-sass', 'fiu-compile-js', 'fiu-copy-images');
const fiuWatchTasks = gulp.parallel('fiu-watch-sass', 'fiu-watch-js');

gulp.task('das',  gulp.series(defaultBuildTasks, defaultWatchTasks));
gulp.task('campaign', gulp.series(campaignBuildTasks, campaignWatchTasks));
gulp.task('fiu', gulp.series(fiuBuildTasks, fiuWatchTasks));
gulp.task('build', gulp.series(defaultBuildTasks, campaignBuildTasks, fiuBuildTasks));

