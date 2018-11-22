'use strict'

const gulp = require('gulp')
const sass = require('gulp-sass');
const paths = require('../../config/paths.json')
const sassOptions = require('../../config/sassOptions.js')

gulp.task('sass-legacy', () => {
  gulp
    .src(paths.src.legacy)
    .pipe(sass(sassOptions))
    .pipe(gulp.dest(paths.dist.legacy))
});

gulp.task('js-legacy', function() {
  return gulp.src(paths.src.legacyJs)
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest(paths.dist.legacyJs));
});

gulp.task('copy-legacy-template-assets', () => {
  gulp.src('./node_modules/govuk_template_mustache/assets/stylesheets/**/*').pipe(gulp.dest('./dist/libs/template'));
});

