/**
 * Gulp file.
 */
var _ = require("lodash");
var gulp = require("gulp");
var eslint = require("gulp-eslint");
var jscs = require("gulp-jscs");
var karma = require("gulp-karma");
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
  "simple-console.js"
], {
  envs: ["browser"]
}));

gulp.task("eslint:frontend:test", _eslint([
  "test/**/*.js"
], {
  envs: ["browser", "mocha"],
  globals: ["expect", "sinon", "SimpleConsole"]
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
// Tests
// ----------------------------------------------------------------------------
// Use `node_modules` Phantom
process.env.PHANTOMJS_BIN = "./node_modules/.bin/phantomjs";

// Sauce labs environments.
var SAUCE_ENVS = {
  /*eslint-disable camelcase*/
  // Already tested in Travis.
  // sl_firefox: {
  //   base: "SauceLabs",
  //   browserName: "firefox"
  // },
  sl_chrome: {
    base: "SauceLabs",
    browserName: "chrome"
  },
  sl_safari_6_8: {
    base: "SauceLabs",
    browserName: "safari",
    platform: "OS X 10.8",
    version: "6.0"
  },
  sl_safari_7_9: {
    base: "SauceLabs",
    browserName: "safari",
    platform: "OS X 10.9",
    version: "7.0"
  },
  sl_safari_8_10: {
    base: "SauceLabs",
    browserName: "safari",
    platform: "OS X 10.10",
    version: "8.0"
  },
  sl_ie_8: {
    base: "SauceLabs",
    browserName: "internet explorer",
    platform: "Windows XP",
    version: "8"
  },
  sl_ie_9: {
    base: "SauceLabs",
    browserName: "internet explorer",
    platform: "Windows 7",
    version: "9"
  },
  sl_ie_10: {
    base: "SauceLabs",
    browserName: "internet explorer",
    platform: "Windows 7",
    version: "10"
  },
  sl_ie_11: {
    base: "SauceLabs",
    browserName: "internet explorer",
    platform: "Windows 7",
    version: "11"
  }
  /*eslint-enable camelcase*/
};

// SauceLabs tag.
var SAUCE_BRANCH = process.env.TRAVIS_BRANCH || "local";
var SAUCE_TAG = process.env.SAUCE_USERNAME + "@" + SAUCE_BRANCH;

// Karma coverage.
var KARMA_COV = {
  reporters: ["spec", "coverage"],
  preprocessors: {
    "simple-console.js": ["coverage"]
  },
  coverageReporter: {
    reporters: [
      { type: "json", file: "coverage.json" },
      { type: "lcov" },
      { type: "text-summary" }
    ],
    dir: "coverage/"
  }
};

// Test wrapper.
var testFrontend = function () {
  var files = [
    // Libraries
    "node_modules/expect.js/index.js",
    "node_modules/sinon/pkg/sinon.js",

    // App files
    "simple-console.js",

    // Tests
    "test/spec/simple-console.spec.js"
  ];

  var opts = _.extend.apply(_, [{
    frameworks: ["mocha"],
    port: 9999,
    reporters: ["spec"],
    client: {
      captureConsole: true,
      mocha: {
        ui: "bdd"
      }
    }
  }].concat(_.toArray(arguments)));

  return function () {
    return gulp
      .src(files)
      .pipe(karma(opts))
      .on("error", function (err) {
        throw err;
      });
  };
};

gulp.task("test:frontend:dev", testFrontend({
  singleRun: true,
  browsers: ["PhantomJS"]
}, KARMA_COV));

gulp.task("test:frontend:ci", testFrontend({
  singleRun: true,
  browsers: ["PhantomJS", "Firefox"]
}, KARMA_COV, {
  reporters: ["spec", "coverage", "coveralls"]
}));

gulp.task("test:frontend:sauce", testFrontend({
  singleRun: true,
  reporters: ["spec", "saucelabs"],
  sauceLabs: {
    testName: "simple-console - Frontend Unit Tests",
    tags: [SAUCE_TAG],
    "public": "public"
  },
  // Timeouts: Allow "n" minutes before saying "good enough". See also:
  // https://github.com/angular/angular.js/blob/master/karma-shared.conf.js
  captureTimeout: 0, // Pass through to SL.
  customLaunchers: SAUCE_ENVS,
  browsers: Object.keys(SAUCE_ENVS)
}));

gulp.task("test:frontend:all", testFrontend({
  port: 9998,
  browsers: ["PhantomJS", "Firefox", "Chrome", "Safari"]
}));

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
gulp.task("check-base", ["chk", "eslint", "jscs"]);
gulp.task("check", ["check-base", "test:frontend:dev"]);
gulp.task("check:ci", ["check-base", "test:frontend:ci"]);
gulp.task("check:all", ["check-base", "test:frontend:all"]);
gulp.task("dev", ["server"]);
gulp.task("default", ["check", "dev"]);
