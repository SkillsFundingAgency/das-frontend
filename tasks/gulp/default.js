 'use strict'

const gulp = require('gulp')
const sass = require('gulp-sass');
const paths = require('../../config/paths.json')
const sassOptions = require('../../config/sassOptions.js')
const rename = require('gulp-rename');


 gulp.task('watch', () => {
  gulp.watch(paths.src.default, ['sass'])
    .on('change', (event) => {
      console.log(`File ${event.path} was ${event.type}, running tasks...`);
    });
});

gulp.task('copy-assets', () => {
  gulp.src(['./node_modules/govuk-frontend/assets/**/*','./src/assets/**/*']).pipe(gulp.dest('./dist/assets/'));
});

gulp.task('copy-rename-autocomplete-css', function () {
  gulp.src(['./node_modules/accessible-autocomplete/src/autocomplete.css'])
    .pipe(rename('_autocomplete.scss'))
    .pipe(gulp.dest('./src/sass/libs/'));
});

gulp.task('copy-js', () => {
  gulp.src(['./node_modules/govuk-frontend/all.js']).pipe(gulp.dest('./dist/libs/govuk-frontend'));
});

gulp.task('sass', () => gulp
  .src(paths.src.default)
  .pipe(sass(sassOptions))
  .pipe(gulp.dest(paths.dist.default)));

gulp.task('copy-libs', () => {
  gulp.src(['./node_modules/accessible-autocomplete/dist/accessible-autocomplete.min.js']).pipe(gulp.dest('./dist/libs/accessible-autocomplete'));
});