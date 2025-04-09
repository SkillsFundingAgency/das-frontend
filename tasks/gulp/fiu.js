'use strict'
const gulp = require('gulp')
const rollup = require('rollup')
const terser = require('@rollup/plugin-terser');
const sass = require('gulp-sass')(require('sass'))
const paths = require('../../config/paths.json')
const sassOptionsFiu = require('../../config/sassOptionsFiu.js')

gulp.task('fiu-watch-sass', function() {
  gulp.watch(paths.src.fiuSass, gulp.series('fiu-compile-sass'))
    .on('change', function (path) {
      console.log(`File ${path} was changed, running tasks...`);
    });
});

gulp.task('fiu-compile-sass', () => gulp
  .src(paths.src.fiuSass)
  .pipe(sass(sassOptionsFiu))
  .pipe(gulp.dest(paths.dist.fiuCss)));

gulp.task('fiu-watch-js', function() {
  gulp.watch([paths.src.fiuJsLibs, paths.src.fiuJs, paths.src.fiuJsInit], gulp.series('fiu-compile-js'))
    .on('change', function (path) {
      console.log(`File ${path} was changed, running tasks...`);
    });
});

gulp.task('fiu-compile-js', () => {
  return rollup.rollup({
      input: './src/fiu/fiu.js',
      plugins: [terser()]
    })
    .then(bundle => {
      return bundle.write({
        file: './dist/fiu/js/app.min.js',
        format: 'iife',
        sourcemap: true
      });
    });
});


gulp.task('fiu-copy-images', (done) => {
  gulp.src(paths.src.fiuImages, {encoding: false}).pipe(gulp.dest(paths.dist.fiuImages));
  done();
});
