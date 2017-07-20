var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

var input = ['src/esfa-sass/*.scss'];
var output = 'dist/css/';

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'compressed',
    includePaths: [
        'src/govuk_template/assets/stylesheets',
        'src/govuk_frontend_toolkit/stylesheets'
    ]
};

var autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

gulp.task('sass', function () {
  return gulp
    .src(input)
    .pipe(sass(sassOptions))
    .pipe(gulp.dest(output));
});

gulp.task('default', ['sass']);