/**
 * Gulp file.
 */
var gulp = require("gulp");
var eslint = require("gulp-eslint");
var jscs = require("gulp-jscs");

// ----------------------------------------------------------------------------
// EsLint
// ----------------------------------------------------------------------------
var _eslint = function (files, cfg) {
  return function () {
    return gulp
      .src(files)
      .pipe(eslint(cfg))
      .pipe(eslint.formatEach("stylish", process.stderr))
      .pipe(eslint.failOnError());
  };
};

gulp.task("eslint:frontend", _eslint([
  "console-stream.js"
], {
  envs: ["browser"]
}));

gulp.task("eslint:backend", _eslint([
  "gulpfile.js",
  "webpack.*.js"
], {
  envs: ["node"]
}));

gulp.task("eslint", ["eslint:frontend", "eslint:backend"]);

// ----------------------------------------------------------------------------
// JsCs
// ----------------------------------------------------------------------------
gulp.task("jscs", function () {
  return gulp
    .src(["*.js"])
    .pipe(jscs());
});

// ----------------------------------------------------------------------------
// Aggregations
// ----------------------------------------------------------------------------
gulp.task("check", ["eslint", "jscs"]);
gulp.task("check:ci", ["eslint", "jscs"]);
gulp.task("default", ["check"]);
