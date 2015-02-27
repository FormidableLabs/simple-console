/**
 * Gulp file.
 */
var gulp = require("gulp");
var eslint = require("gulp-eslint");
var jscs = require("gulp-jscs");
var connect = require("gulp-connect");

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

gulp.task("eslint:frontend:test", _eslint([
  "test/**/*.js"
], {
  envs: ["browser", "mocha"],
  globals: ["expect", "sinon"]
}));

gulp.task("eslint:backend", _eslint([
  "gulpfile.js",
  "webpack.*.js"
], {
  envs: ["node"]
}));

gulp.task("eslint", [
  "eslint:frontend", "eslint:frontend:test",
  "eslint:backend"
]);

// ----------------------------------------------------------------------------
// JsCs
// ----------------------------------------------------------------------------
gulp.task("jscs", function () {
  return gulp
    .src(["*.js"])
    .pipe(jscs());
});

// ----------------------------------------------------------------------------
// Publication checks
// ----------------------------------------------------------------------------
gulp.task("chk", function () {
  var bower = require("./bower.json");
  var npm = require("./package.json");

  if (bower.version !== npm.version) {
    throw new Error(
      "Bower (" + bower.version + ") / NPM  (" + npm.version + ") mismatch");
  }
});

// ----------------------------------------------------------------------------
// Servers
// ----------------------------------------------------------------------------
// Static server.
// Test page: http://127.0.0.1:4321/test/test.html
gulp.task("server", function () {
  connect.server({
    root: __dirname,
    port: 4321
  });
});

// ----------------------------------------------------------------------------
// Aggregations
// ----------------------------------------------------------------------------
gulp.task("check", ["chk", "eslint", "jscs"]);
gulp.task("check:ci", ["chk", "eslint", "jscs"]);
gulp.task("dev", ["server"]);
gulp.task("default", ["check", "dev"]);
