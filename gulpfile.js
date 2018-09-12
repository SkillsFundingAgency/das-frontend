"use strict";
const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');

const input = './src/sass/*.scss';

const output = './dist/css/';

let sassOptions;

sassOptions = {
  errLogToConsole: true,
  outputStyle: 'compressed',
  includePaths: [
    'node_modules/govuk-frontend'
  ],
};

gulp.task('watch', () => {
  gulp.watch(input, ['sass'])
    .on('change', (event) => {
      console.log(`File ${event.path} was ${event.type}, running tasks...`);
    });
});

gulp.task('copy-assets', () => {
  gulp.src('node_modules/govuk-frontend/assets/**/*').pipe(gulp.dest('./dist/assets/'));
});

gulp.task('copy-js', () => {
  gulp.src('node_modules/govuk-frontend/*.js').pipe(gulp.dest('./dist/js/'));
});

gulp.task('sass', () => gulp
  .src(input)
  .pipe(sass(sassOptions))
  .pipe(gulp.dest(output)));

gulp.task('default', ['sass', 'watch']);