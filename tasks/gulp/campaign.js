'use strict'
const gulp = require('gulp')
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const paths = require('../../config/paths.json')
const sassOptionsCampaign = require('../../config/sassOptionsCampaign.js')

gulp.task('watch-campaign', () => {
  gulp.watch(paths.src.campaign, ['sass-campaign'])
    .on('change', (event) => {
      console.log(`File ${event.path} was ${event.type}, running tasks...`);
    });
});


gulp.task('js-campaign', function() {
  return gulp.src(paths.src.campaignJs)
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest(paths.dist.campaignJs));
});

gulp.task('copy-plyr-js', () => {
  gulp.src('./node_modules/plyr/dist/plyr.min.js').pipe(gulp.dest('./dist/campaign/js/'));
});

gulp.task('sass-campaign', () => gulp
  .src(paths.src.campaign)
  .pipe(sass(sassOptionsCampaign))
  .pipe(gulp.dest(paths.dist.campaign)));

gulp.task('image-campaign', () => {
  gulp.src(paths.src.campaignImages).pipe(gulp.dest(paths.dist.campaignImages));
});
  

gulp.task('components-campaign',() => gulp
.src(['./src/components/**/*.js','./src/components/**/*.njk']).pipe(gulp.dest('./dist/campaign/components/')));
