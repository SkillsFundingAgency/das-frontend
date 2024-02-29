'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'))
const rename = require('gulp-rename');
const paths = require('../../config/paths.json');
const sassOptions = require('../../config/sassOptions.js');

gulp.task('das-watch-sass', function() {
  return gulp.watch(paths.src.dasSass, gulp.series('das-compile-sass')).on('change', function (file) {
    console.log(`File ${file} was changed, running tasks...`);
  });
});

gulp.task('das-compile-sass', function() {
  return gulp.src(paths.src.dasSass)
    .pipe(sass(sassOptions))
    .pipe(gulp.dest(paths.dist.dasCss));
});

gulp.task('das-copy-images', function() {
  return gulp.src(paths.src.dasImages).pipe(gulp.dest(paths.dist.dasImages));
});

gulp.task('das-copy-libs', (done) => {
  gulp.src(['./node_modules/govuk-frontend/dist/govuk/assets/**/*','./src/assets/**/*']).pipe(gulp.dest('./dist/assets/'));
  gulp.src([paths.src.dasJsLibPath + '/govuk-frontend/all.js']).pipe(gulp.dest('./dist/libs/govuk-frontend'));
  gulp.src(['./node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js']).pipe(gulp.dest('./dist/libs/govuk-frontend'));
  gulp.src(['./node_modules/accessible-autocomplete/dist/accessible-autocomplete.min.js']).pipe(gulp.dest('./dist/libs/accessible-autocomplete'));
  gulp.src([paths.src.dasJsLibPath + '/das-postcode/lookupService.js']).pipe(gulp.dest('./dist/libs/das-postcode'));
  gulp.src(['./node_modules/html5shiv/dist/html5shiv.min.js']).pipe(gulp.dest('./dist/libs/html5shiv'));
  gulp.src(['./node_modules/jquery/dist/jquery.min.js']).pipe(gulp.dest('./dist/libs/jquery'));
  gulp.src(['./node_modules/jquery-ui-dist/jquery-ui.min.js']).pipe(gulp.dest('./dist/libs/jquery-ui'));
  gulp.src(['./node_modules/jquery-validation/dist/jquery.validate.min.js']).pipe(gulp.dest('./dist/libs/jquery-validation'));
  gulp.src(['./node_modules/jquery-validation-unobtrusive/dist/jquery.validate.unobtrusive.min.js']).pipe(gulp.dest('./dist/libs/jquery-validation-unobtrusive'));
  gulp.src(['./node_modules/select2/dist/js/select2.min.js']).pipe(gulp.dest('./dist/libs/select2'));
  gulp.src([paths.src.dasJsLibPath + '/select2/style.css']).pipe(gulp.dest('./dist/libs/select2'));
  gulp.src(['./node_modules/jquery.are-you-sure/jquery.are-you-sure.js']).pipe(rename('jquery-are-you-sure.js')).pipe(gulp.dest('./dist/libs/jquery-are-you-sure')); // Rename to remove dots from filename, avoid confusion with the CDN script
  gulp.src(['./node_modules/accessible-autocomplete/src/autocomplete.css']).pipe(rename('_autocomplete.scss')).pipe(gulp.dest('./src/das/sass/libs/')); // Rename CSS file to SCSS so can be imported into application SCSS
  done();
});