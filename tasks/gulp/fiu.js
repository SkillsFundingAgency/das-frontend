'use strict'
const gulp = require('gulp')
const sass = require('gulp-sass');
const concat = require('gulp-concat');
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

gulp.task('fiu-compile-js', function() {
  return gulp.src(paths.src.fiuJs)
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest(paths.dist.fiuJs));
});

gulp.task('fiu-copy-images', (done) => {
  gulp.src(paths.src.fiuImages).pipe(gulp.dest(paths.dist.fiuImages));
  done();
});

gulp.task('fiu-copy-libs', (done) => {
  gulp.src('./node_modules/plyr/dist/plyr.min.js').pipe(gulp.dest(paths.dist.fiuJs));
  gulp.src('./src/fiu/javascript/libs/*.js').pipe(gulp.dest(paths.dist.fiuJs + '/libs'));
  done();
});
