/*!
 * simple-console
 * --------------
 * A small, cross-browser-friendly `console` wrapper.
 */
(function (root) {
  // Patches
  var EMPTY_OBJ = {};
  var NOOP = function () {};

  // Console attributes
  var props = ["memory"];
  var meths = (
    "assert,clear,count,debug,dir,dirxml,error,exception,group," +
    "groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles," +
    "profileEnd,show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace" +
    ",warn"
  ).split(",");

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
  // Global_Objects/Array/isArray
  var isArray = Array.isArray || function (arg) {
    return Object.prototype.toString.call(arg) === "[object Array]";
  };

  /**
   * Console abstraction.
   *
   * Provides a drop-in replacement for `console` with a few extras.
   *
   * @param {Object} opts       options object
   * @param {Object} opts.patch patch underlying `console`? (default: `true`)
   * @param {Object} opts.noop  have all methods be NOOP?   (default: `true`)
   */
  var SimpleConsole = function (opts) {
    var self = this;
    var i;

    // Starting state.
    var bind = self._getBind();
    var con = self._getConsole();
    var noConsole = !con; // Stash if console unavailable.

    // Protect variables.
    opts = opts || {};
    con = con || {};

    // Target: Add properties to console if patching.
    var target = {};
    if (opts.patch) {
      // Ensure that `window.console` is actually created, and set as target.
      target = window.console = window.console || target;
    }

    // Patch properties, methods.
    for (i = 0; i < props.length; i++) {
      // *Note*: Could consider _copying_ values.
      self[props[i]] = target[props[i]] = opts.noop ?
        EMPTY_OBJ :
        con[props[i]] || EMPTY_OBJ;
    }

    // Enable "apply" and "bind" on methods by converting to real function.
    // See: http://patik.com/blog/complete-cross-browser-console-log/
    for (i = 0; i < meths.length; i++) {
      // Set context _and_ the target.
      self[meths[i]] = target[meths[i]] = (function (methFn) {
        if (opts.noop || noConsole || !methFn) {
          // Noop cases.
          return NOOP;

        } else if (isArray(methFn)) {
          // Straight assign any array objects.
          // *Note*: Could do `.slice(0);` to clone.
          //
          // Fixes Safari on Mac OS X 10.9 on Sauce.
          // Issue is `console.profiles`, which is an array.
          // See: https://github.com/FormidableLabs/simple-console/issues/3
          // See: https://saucelabs.com/tests/9a89e381c91c4e43b25ab8ee16a514e1
          return methFn;

        } else if (bind) {
          // IE9 and most others: Bind to our create real function.
          // Should work if `console.FOO` is `function` or `object`.
          return bind.call(methFn, con);
        }

        // IE8: No bind, so even more tortured.
        return function () {
          Function.prototype.call.call(methFn, con,
            Array.prototype.slice.call(arguments));
        };
      })(con[meths[i]]);
    }
  };

  /**
   * Accessor to console object. (Cached).
   *
   * @returns {Object} the console object or `null` if unavailable.
   * @api private
   */
  var _console;
  SimpleConsole.prototype._getConsole = function () {
    if (typeof _console !== "undefined") { return _console; }
    _console = window.console || null;
    return _console;
  };

  /**
   * Accessor to bind object. (Cached).
   *
   * @returns {Object} the console object or `null` if unavailable.
   * @api private
   */
  var _bind;
  SimpleConsole.prototype._getBind = function () {
    if (typeof _bind !== "undefined") { return _bind; }
    _bind = Function.prototype.bind || null;
    return _bind;
  };

  // UMD wrapper: Borrowed from webpack version.
  /* istanbul ignore next */
  /*global exports define*/
  if (typeof exports === "object" && typeof module === "object") {
    // CommonJS
    module.exports = SimpleConsole;
  } else if (typeof define === "function" && define.amd) {
    // AMD
    define(function () {
      return SimpleConsole;
    });
  } else {
    // VanillaJS / Old exports
    var mod = typeof exports === "object" ? exports : root;
    mod.SimpleConsole = SimpleConsole;
  }
})(this);
