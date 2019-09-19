'use strict'

const gulp = require('gulp')
const rollup = require('gulp-better-rollup')
const gulpif = require('gulp-if')
const eol = require('gulp-eol')
const rename = require('gulp-rename')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs');
const terser = require('gulp-terser');
const concat = require('gulp-concat');

const configPaths = require('../../config/paths.json')

gulp.task('das-compile-js', function() {
  return gulp.src([
      '!' + configPaths.src.dasJs,
      configPaths.src.defaultJs,
      configPaths.src.defaultJsMain
  ]).pipe(concat('app.min.js'))
    .pipe(terser({ module: true }))
    .pipe(gulp.dest(configPaths.dist.defaultJs));
});

gulp.task('das-watch-js', function() {

  gulp.watch(['!' + configPaths.src.dasJs, configPaths.src.defaultJs], gulp.series('das-compile-js'))
    .on('change', function (path) {
      console.log(`File ${path} was changed, running tasks...`);
    });

  gulp.watch([configPaths.src.componentJs, configPaths.src.dasJs], gulp.series('das-compile-js-components-dev'))
    .on('change', function (path) {
      console.log(`File ${path} was changed, running tasks...`);
    });

});

gulp.task('das-compile-js-components-dev', function () {
  return minifyJs(false);
});

gulp.task('das-compile-js-components', function () {
  return minifyJs(true);
});

var minifyJs = function (isDist) {
  let srcFile = configPaths.src.dasJs
  let jsDest = configPaths.dist.defaultJs
  return gulp.src(srcFile)
    .pipe(rollup({
      name: 'DASFrontend',
      legacy: true,
      format: 'umd',
    })).on('error', function (e) { console.log(e) })
    .pipe(gulpif(isDist, terser({ module: true })))
    .pipe(gulpif(isDist,
      rename({
        basename: 'das-all',
        extname: '.min.js'
      })
    ))
    .pipe(eol())
    .pipe(gulp.dest(jsDest));
};
