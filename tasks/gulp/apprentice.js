'use strict';
const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const sass = require('gulp-sass')(require('sass'));
const paths = require('../../config/paths.json');
const sassOptions = require('../../config/sassOptions.js');

gulp.task('apprentice-watch-sass', function () {
  gulp
    .watch(paths.src.apprenticeSass, gulp.series('apprentice-compile-sass'))
    .on('change', function (path) {
      console.log(`File ${path} was changed, running tasks...`);
    });
});

gulp.task('apprentice-compile-sass', () =>
  gulp
    .src(paths.src.apprenticeSass)
    .pipe(sass(sassOptions))
    .pipe(gulp.dest(paths.dist.apprenticeCss))
);

gulp.task('apprentice-watch-js', function () {
  gulp
    .watch(
      [paths.src.apprenticeJs, paths.src.apprenticeJsInit],
      gulp.series('apprentice-compile-js')
    )
    .on('change', function (path) {
      console.log(`File ${path} was changed, running tasks...`);
    });
});

gulp.task('apprentice-compile-js', function () {
  return gulp
    .src([paths.src.apprenticeJs, paths.src.apprenticeJsInit])
    .pipe(babel())
    .pipe(terser())
    .pipe(concat('apprentice.min.js'))
    .pipe(gulp.dest(paths.dist.apprenticeJs));
});
