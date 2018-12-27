'use strict'
const gulp = require('gulp')
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const paths = require('../../config/paths.json')
const sassOptions = require('../../config/sassOptions.js')

gulp.task('watch-campaign', () => {
  gulp.watch(paths.src.campaign, ['sass-campaign'])
    .on('change', (event) => {
      console.log(`File ${event.path} was ${event.type}, running tasks...`);
    });
})


gulp.task('js-campaign', function() {
  return gulp.src(paths.src.campaignJs)
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest(paths.dist.campaignJs));
});

gulp.task('sass-campaign', () => gulp
  .src(paths.src.campaign)
  .pipe(sass(sassOptions))
  .pipe(gulp.dest(paths.dist.campaign)));

gulp.task('image-campaign', () => {
  gulp.src(paths.src.campaignImages).pipe(gulp.dest(paths.dist.campaignImages));
});
  

gulp.task('components-campaign',() => gulp
.src(['./src/components/**/*.js','./src/components/**/*.njk']).pipe(gulp.dest('./dist/campaign/components/')));
