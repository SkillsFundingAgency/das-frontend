'use strict'
const gulp = require('gulp')
const sass = require('gulp-sass');
const paths = require('../../config/paths.json')
const sassOptions = require('../../config/sassOptions.js')

gulp.task('watch-campaign', () => {
  gulp.watch(paths.src.campaign, ['sass-campaign'])
    .on('change', (event) => {
      console.log(`File ${event.path} was ${event.type}, running tasks...`);
    });
})

gulp.task('sass-campaign', () => gulp
  .src(paths.src.campaign)
  .pipe(sass(sassOptions))
  .pipe(gulp.dest(paths.dist.campaign)));

