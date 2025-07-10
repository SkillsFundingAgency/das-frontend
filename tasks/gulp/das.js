'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'))
const rename = require('gulp-rename');
const paths = require('../../config/paths.json');
const sassOptions = require('../../config/sassOptions.js');
const terser = require('gulp-terser');

gulp.task('das-watch-sass', function() {
  return gulp.watch(paths.src.dasSass, gulp.series('das-compile-sass')).on('change', function (file) {
    console.log(`File ${file} was changed, running tasks...`);
  });
});

gulp.task('das-compile-sass', function() {
  return gulp.src(paths.src.dasSass)
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(gulp.dest(paths.dist.dasCss));
});

gulp.task('das-copy-images', function() {
  return gulp.src(paths.src.dasImages).pipe(gulp.dest(paths.dist.dasImages));
});

gulp.task('das-copy-libs', (done) => {
  gulp.src(['./src/das/javascript/sessionTimeout.js'], {encoding: false}).pipe(terser()).pipe(gulp.dest('./dist/js/'));
  gulp.src(['./node_modules/govuk-frontend/dist/govuk/assets/**/*'], {encoding: false}).pipe(gulp.dest('./dist/assets/'));
  gulp.src([paths.src.dasJsLibPath + '/govuk-frontend/all.js'], {encoding: false}).pipe(gulp.dest('./dist/libs/govuk-frontend'));
  gulp.src(['./node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js'], {encoding: false}).pipe(gulp.dest('./dist/libs/govuk-frontend'));
  gulp.src(['./node_modules/accessible-autocomplete/dist/accessible-autocomplete.min.js'], {encoding: false}).pipe(gulp.dest('./dist/libs/accessible-autocomplete'));
  gulp.src([paths.src.dasJsLibPath + '/das-postcode/lookupService.js'], {encoding: false}).pipe(gulp.dest('./dist/libs/das-postcode'));
  gulp.src(['./node_modules/jquery/dist/jquery.min.js'], {encoding: false}).pipe(gulp.dest('./dist/libs/jquery'));
  gulp.src(['./node_modules/select2/dist/js/select2.min.js'], {encoding: false}).pipe(gulp.dest('./dist/libs/select2'));
  gulp.src([paths.src.dasJsLibPath + '/select2/style.css'], {encoding: false}).pipe(gulp.dest('./dist/libs/select2'));
  gulp.src(['./node_modules/accessible-autocomplete/src/autocomplete.css'], {encoding: false}).pipe(rename('_autocomplete.scss')).pipe(gulp.dest('./src/das/sass/libs/')); // Rename CSS file to SCSS so can be imported into application SCSS
  done();
});
