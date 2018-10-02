"use strict";
const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');

const input = './src/sass/**/*.scss';
const output = './dist/css/';

const inputLegacy = './src/legacy/sass/**/*.scss';
const outputLegacy = './dist/legacy/css/';

let sassOptions;

sassOptions = {
  errLogToConsole: true,
  outputStyle: 'compressed',
  includePaths: [
    'node_modules/govuk_template_mustache/source/assets/stylesheets',
    'node_modules/govuk_frontend_toolkit/stylesheets',
    'node_modules/govuk-elements-sass/public/sass',
    'node_modules/govuk-frontend',
    'src/sass'
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

gulp.task('copy-legacy-template-assets', () => {
  gulp.src('node_modules/govuk_template_mustache/assets/stylesheets/**/*').pipe(gulp.dest('./dist/libs/template'));
});

gulp.task('sass', () => gulp
  .src(input)
  .pipe(sass(sassOptions))
  .pipe(gulp.dest(output)));

gulp.task('sass-legacy', () => gulp
  .src(inputLegacy)
  .pipe(sass(sassOptions))
  .pipe(gulp.dest(outputLegacy)));


gulp.task('legacy', ['copy-legacy-template-assets', 'sass-legacy']);
gulp.task('default', ['sass', 'watch']);