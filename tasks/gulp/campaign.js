'use strict'
const gulp = require('gulp')
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const paths = require('../../config/paths.json')
const sassOptionsCampaign = require('../../config/sassOptionsCampaign.js')

gulp.task('campaign-watch-sass', function() {
  gulp.watch(paths.src.campaign, gulp.series('campaign-compile-sass'))
    .on('change', function (path) {
      console.log(`File ${path} was changed, running tasks...`);
    });
});

gulp.task('campaign-compile-sass', () => gulp
  .src(paths.src.campaign)
  .pipe(sass(sassOptionsCampaign))
  .pipe(gulp.dest(paths.dist.campaign)));

gulp.task('campaign-compile-js', function() {
  return gulp.src(paths.src.campaignJs)
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest(paths.dist.campaignJs));
});

gulp.task('campaign-copy-images', (done) => {
  gulp.src(paths.src.campaignImages).pipe(gulp.dest(paths.dist.campaignImages));
  done();
});

gulp.task('campaign-copy-libs', (done) => {
  gulp.src('./node_modules/plyr/dist/plyr.min.js').pipe(gulp.dest(paths.dist.campaignJs));
  gulp.src('./src/campaign/javascript/libs/*.js').pipe(gulp.dest(paths.dist.campaignJs + '/libs'));
  done();
});
