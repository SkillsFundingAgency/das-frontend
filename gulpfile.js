"use strict";
const gulp = require('gulp');

require('./tasks/gulp/default')
require('./tasks/gulp/campaign')
require('./tasks/gulp/dasJs')

const defaultBuildTasks = ['das-copy-libs', 'das-compile-sass', 'das-compile-js', 'das-compile-js-components'];
const defaultWatchTasks = ['das-watch-sass', 'das-watch-js'];

const campaignBuildTasks = ['sass-campaign', 'js-campaign','image-campaign', 'copy-plyr-js', 'copy-campaign-libs'];
const campaignWatchTasks = ['watch-campaign'];

gulp.task('default',  defaultBuildTasks.concat(defaultWatchTasks));
gulp.task('campaign', campaignBuildTasks.concat(campaignWatchTasks));
gulp.task('build', defaultBuildTasks.concat(campaignBuildTasks));
