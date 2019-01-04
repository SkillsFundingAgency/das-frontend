'use strict'

const gulp = require('gulp')
const configPaths = require('../../config/paths.json')
const rollup = require('gulp-better-rollup')
const gulpif = require('gulp-if')
const uglify = require('gulp-uglify')
const eol = require('gulp-eol')
const rename = require('gulp-rename')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs');

const isDist = false

const rollupGlobals = {
  '@angular/core': 'ng.core',
  '@angular/platform-browser': 'ng.platformBrowser',
  '@angular/common': 'ng.common',
  '@angular/forms': 'ng.forms',
  '@angular/router': 'ng.router',
  'rxjs/Observable': 'Rx.Observable',
  'rxjs/Subject': 'Rx.Subject',
  'typescript': 'ts'
}
// Compile js task for preview ----------
// --------------------------------------
gulp.task('js:compile', () => {
    // for dist/ folder we only want das 'all.js' file
    let srcFile = configPaths.src.dasJs
    let jsDest = configPaths.dist.defaultJs
    return gulp.src(srcFile)
      .pipe(rollup({
        // Used to set the `window` global and UMD/AMD export name.
        name: 'DASFrontend',
        plugins: [resolve(), commonjs()],
        // Legacy mode is required for IE8 support
        legacy: true,
        // UMD allows the published bundle to work in CommonJS and in the browser.
        format: 'umd',
      }))
      .pipe(gulpif(isDist, uglify({
        ie8: true
      })))
      .pipe(gulpif(isDist,
        rename({
          basename: 'das-frontend',
          extname: '.min.js'
        })
      ))
      .pipe(eol())
      .pipe(gulp.dest(jsDest))
  })