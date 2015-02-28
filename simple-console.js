/*!
 * simple-console
 * --------------
 * A small, cross-browser-friendly `console` wrapper.
 */
(function (root) {
  // Memoizations.
  var _console;
  var _bind;

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
   * @param {Object} target console object to _patch_ or `null` for new object.
   */
  var SimpleConsole = function (target) {
    var con = target || this._getConsole();
    var bind = this._getBind();
    var noConsole = !con;
    var i;

    // Get targets
    target = target || this;
    con = con || {};

    // Patch properties, methods.
    for (i = 0; i < props.length; i++) {
      target[props[i]] = con[props[i]] || EMPTY_OBJ;
    }

    // Enable "apply" and "bind" on methods by converting to real function.
    // See: http://patik.com/blog/complete-cross-browser-console-log/
    for (i = 0; i < meths.length; i++) {
      (function (meth, methFn) {
        if (noConsole || !methFn) {
          // No console or method: Noop it.
          target[meth] = NOOP;

        } else if (isArray(methFn)) {
          // Straight assign any array objects.
          // *Note*: Could do `.slice(0);` to clone.
          //
          // Fixes Safari on Mac OS X 10.9 on Sauce.
          // Issue is `console.profiles`, which is an array.
          // See: https://github.com/FormidableLabs/simple-console/issues/3
          // See: https://saucelabs.com/tests/9a89e381c91c4e43b25ab8ee16a514e1
          target[meth] = methFn;

        } else if (bind) {
          // IE9 and most others: Bind to our create real function.
          // Should work if `console.FOO` is `function` or `object`.
          target[meth] = bind.call(methFn, con);

        } else {
          // IE8: No bind, so even more tortured.
          target[meth] = function () {
            Function.prototype.call.call(methFn, con,
              Array.prototype.slice.call(arguments));
          };
        }
      })(meths[i], con[meths[i]]);
    }
  };

  /**
   * Accessor to console object. (Cached).
   *
   * @returns {Object} the console object or `null` if unavailable.
   * @api private
   */
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
  SimpleConsole.prototype._getBind = function () {
    if (typeof _bind !== "undefined") { return _bind; }
    _bind = Function.prototype.bind || null;
    return _bind;
  };

  /**
   * Patch console object.
   *
   * @param {Object}  con console object
   * @returns {Object}    patched console object
   * @api private
   */
  SimpleConsole.patch = function (con) {
    con = con || window.console || {};

    // Create simple console object and proxy methods.
    new SimpleConsole(con);

    return con;
  };

  // UMD wrapper: Borrowed from webpack version.
  /* istanbul ignore next */
  function umd() {
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
  }

  // Wrap.
  umd(SimpleConsole);
})(this);