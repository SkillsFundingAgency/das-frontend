"use strict";
const gulp = require('gulp');

require('./tasks/gulp/default')
require('./tasks/gulp/campaign')
require('./tasks/gulp/dasJs')

const defaultBuildTasks = ['copy-assets', 'copy-js', 'sass', 'js:compile', 'copy-libs'];
const defaultWatchTasks = ['watch', 'watch-js-das-all'];

const campaignBuildTasks = ['sass-campaign', 'js-campaign','image-campaign', 'copy-plyr-js'];
const campaignWatchTasks = ['watch-campaign'];

gulp.task('default',  defaultBuildTasks.concat(defaultWatchTasks));
gulp.task('campaign', campaignBuildTasks.concat(campaignWatchTasks));
gulp.task('build', defaultBuildTasks.concat(campaignBuildTasks));
