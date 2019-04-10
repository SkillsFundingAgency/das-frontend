"use strict";
const gulp = require('gulp');

require('./tasks/gulp/das')
require('./tasks/gulp/campaign')
require('./tasks/gulp/dasJs')

const defaultBuildTasks = ['das-copy-libs', 'das-compile-sass', 'das-compile-js', 'das-compile-js-components'];
const defaultWatchTasks = ['das-watch-sass', 'das-watch-js'];

const campaignBuildTasks = ['campaign-copy-libs', 'campaign-compile-sass', 'campaign-compile-js', 'campaign-copy-images'];
const campaignWatchTasks = ['campaign-watch-sass'];

gulp.task('das',  defaultBuildTasks.concat(defaultWatchTasks));
gulp.task('campaign', campaignBuildTasks.concat(campaignWatchTasks));
gulp.task('build', defaultBuildTasks.concat(campaignBuildTasks));
