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
      configPaths.src.defaultJs
  ]).pipe(concat('app.min.js'))
    .pipe(terser({ module: true }))
    .pipe(gulp.dest(configPaths.dist.defaultJs));
});

gulp.task('das-watch-js', () => {

  gulp.watch([
      '!' + configPaths.src.dasJs,
      configPaths.src.defaultJs
    ], ['das-compile-js'])
    .on('change', (event) => {
    console.log(`File ${event.path} was ${event.type}, running tasks...`);
  });

  gulp.watch([configPaths.src.componentJs, configPaths.src.dasJs], ['das-compile-js-components'])
    .on('change', (event) => {
      console.log(`File ${event.path} was ${event.type}, running tasks...`);
    });
});

var minifyJs = function (isDist) {
  let srcFile = configPaths.src.dasJs
  let jsDest = configPaths.dist.defaultJs
  return gulp.src(srcFile)
    .pipe(rollup({
      name: 'DASFrontend',
      plugins: [resolve(), commonjs()],
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

gulp.task('das-compile-js-components', ['das-compile-js-components-dev'], () => {
  return minifyJs(true);
});

gulp.task('das-compile-js-components-dev', () => {
  return minifyJs(false);
});

