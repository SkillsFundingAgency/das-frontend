'use strict'

const gulp = require('gulp')
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const paths = require('../../config/paths.json')
const sassOptions = require('../../config/sassOptions.js')

gulp.task('das-watch-sass', () => {
  gulp.watch(paths.src.default, ['das-compile-sass'])
    .on('change', (event) => {
      console.log(`File ${event.path} was ${event.type}, running tasks...`);
    });
});

gulp.task('das-compile-sass', () => gulp
  .src(paths.src.default)
  .pipe(sass(sassOptions))
  .pipe(gulp.dest(paths.dist.default)));

gulp.task('das-copy-images', () => {
  gulp.src(paths.src.defaultImages).pipe(gulp.dest(paths.dist.defaultImages));
});

gulp.task('das-copy-libs', () => {
  gulp.src(['./node_modules/govuk-frontend/assets/**/*','./src/assets/**/*']).pipe(gulp.dest('./dist/assets/'));
  gulp.src(['./node_modules/govuk-frontend/all.js']).pipe(gulp.dest('./dist/libs/govuk-frontend'));
  gulp.src(['./node_modules/accessible-autocomplete/dist/accessible-autocomplete.min.js']).pipe(gulp.dest('./dist/libs/accessible-autocomplete'));
  gulp.src(['./src/libs/das-postcode/lookupService.js']).pipe(gulp.dest('./dist/libs/das-postcode'));
  gulp.src(['./node_modules/html5shiv/dist/html5shiv.min.js']).pipe(gulp.dest('./dist/libs/html5shiv'));
  gulp.src(['./node_modules/jquery/dist/jquery.min.js']).pipe(gulp.dest('./dist/libs/jquery'));
  gulp.src(['./node_modules/jquery-ui-dist/jquery-ui.min.js']).pipe(gulp.dest('./dist/libs/jquery-ui'));
  gulp.src(['./node_modules/jquery-validation/dist/jquery.validate.min.js']).pipe(gulp.dest('./dist/libs/jquery-validation'));
  gulp.src(['./node_modules/jquery-validation-unobtrusive/dist/jquery.validate.unobtrusive.min.js']).pipe(gulp.dest('./dist/libs/jquery-validation-unobtrusive'));
  gulp.src(['./node_modules/select2/dist/js/select2.min.js']).pipe(gulp.dest('./dist/libs/select2'));
  gulp.src(['./src/libs/select2/style.css']).pipe(gulp.dest('./dist/libs/select2'));
  gulp.src(['./node_modules/jquery.are-you-sure/jquery.are-you-sure.js'])
    .pipe(rename('jquery-are-you-sure.js'))
    .pipe(gulp.dest('./dist/libs/jquery-are-you-sure')); // Rename to remove dots from filename, avoid confusion with the CDN script
  gulp.src(['./node_modules/accessible-autocomplete/src/autocomplete.css'])
    .pipe(rename('_autocomplete.scss'))
    .pipe(gulp.dest('./src/sass/libs/')); // Rename CSS file to SCSS so can be imported into application SCSS
});