"use strict";

const gulp = require("gulp");

require("./tasks/gulp/das");
require("./tasks/gulp/fiu");
require("./tasks/gulp/apprentice");
require("./tasks/gulp/dasJs");

const defaultBuildTasks = gulp.series(
  "das-copy-libs",
  "das-copy-images",
  "das-compile-sass",
  "das-compile-js",
  "das-compile-js-components",
  "das-compile-js-components-dev",
);
const defaultWatchTasks = gulp.parallel("das-watch-sass", "das-watch-js");
const fiuBuildTasks = gulp.series(
  "fiu-compile-sass",
  "fiu-compile-js",
  "fiu-copy-images",
);
const fiuWatchTasks = gulp.parallel("fiu-watch-sass", "fiu-watch-js");
const apprenticeBuildTasks = gulp.series(
  "apprentice-compile-sass",
  "apprentice-compile-js",
);
const apprenticeWatchTasks = gulp.parallel(
  "apprentice-watch-sass",
  "apprentice-watch-js",
);

gulp.task("das", gulp.series(defaultBuildTasks, defaultWatchTasks));
gulp.task("fiu", gulp.series(fiuBuildTasks, fiuWatchTasks));
gulp.task(
  "apprentice",
  gulp.series(apprenticeBuildTasks, apprenticeWatchTasks),
);
gulp.task(
  "build",
  gulp.series(defaultBuildTasks, fiuBuildTasks, apprenticeBuildTasks),
);
