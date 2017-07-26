var gulp = require('gulp');
var sass = require('gulp-sass');
var gulpcopy = require('gulp-copy');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');


var input = ['src/esfa-sass/*.scss'];
var output = 'distcss/css/';

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

gulp.task('build-js', function() {
  return gulp.src(['src/javascript/*/*.js', 'src/javascript/*.js'])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest('distjavascript/javascript'));
});

gulp.task('default', ['sass', 'build-js']);