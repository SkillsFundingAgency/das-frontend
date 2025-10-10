'use strict';

const gulp = require('gulp');
const rollup = require('rollup');
const terser = require('@rollup/plugin-terser');
const concat = require('gulp-concat');

const configPaths = require('../../config/paths.json');

gulp.task('das-compile-js', function () {
  return gulp
    .src(['!' + configPaths.src.dasJsComponent, configPaths.src.dasJs, configPaths.src.dasJsApp])
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest(configPaths.dist.dasJs));
});

gulp.task('das-watch-js', function () {
  gulp
    .watch([configPaths.src.dasJs, configPaths.src.dasJsApp], gulp.series('das-compile-js'))
    .on('change', function (path) {
      console.log(`File ${path} was changed, running tasks...`);
    });

  gulp
    .watch(
      [configPaths.src.dasJsComponents, configPaths.src.dasJsComponent],
      gulp.series('das-compile-js-components-dev')
    )
    .on('change', function (path) {
      console.log(`File ${path} was changed, running tasks...`);
    });
});

gulp.task('das-compile-js-components', async () => {
  const bundle = await rollup.rollup({
    input: configPaths.src.dasJsComponent,
    plugins: [terser()],
  });
  await bundle.write({
    file: configPaths.dist.dasJs + '/das-all.min.js',
    format: 'umd',
    name: 'DASFrontend',
    sourcemap: true,
  });
});

// UnMinified version for development
gulp.task('das-compile-js-components-dev', async () => {
  const bundle = await rollup.rollup({
    input: configPaths.src.dasJsComponent,
  });
  await bundle.write({
    file: configPaths.dist.dasJs + '/das-all.js',
    format: 'umd',
    name: 'DASFrontend',
  });
});
