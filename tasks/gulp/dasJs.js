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
const terser = require('gulp-terser');


gulp.task('watch-js-das-all', () => {
  gulp.watch(configPaths.src.componentJs, ['js:compile'])
    .on('change', (event) => {
      console.log(`File ${event.path} was ${event.type}, running tasks...`);
    });
  gulp.watch(configPaths.src.dasJs, ['js-components'])
    .on('change', (event) => {
      console.log(`File ${event.path} was ${event.type}, running tasks...`);
    });
});

var minifyJs = function (isDist) {
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
}


// Compile js task for preview ----------
// --------------------------------------
gulp.task('js:compile', ['js:compile-dev'], () => {


  return minifyJs(true);
})

gulp.task('js:compile-dev', () => {


  return minifyJs(false);
})

