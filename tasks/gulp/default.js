 'use strict'

const gulp = require('gulp')
const sass = require('gulp-sass');
const paths = require('../../config/paths.json')
const sassOptions = require('../../config/sassOptions.js')

gulp.task('watch', () => {
  gulp.watch(paths.src.default, ['sass'])
    .on('change', (event) => {
      console.log(`File ${event.path} was ${event.type}, running tasks...`);
    });
});

gulp.task('copy-assets', () => {
  gulp.src(['./node_modules/govuk-frontend/assets/**/*','./src/assets/**/*']).pipe(gulp.dest('./dist/assets/'));
});

gulp.task('copy-js', () => {
  gulp.src(['./node_modules/govuk-frontend/*.js','./node_modules/govuk-frontend/vendor/**.js','./node_modules/govuk-frontend/components/**/*.js']).pipe(gulp.dest('./dist/js/'));
});

gulp.task('sass', () => gulp
  .src(paths.src.default)
  .pipe(sass(sassOptions))
  .pipe(gulp.dest(paths.dist.default)));

