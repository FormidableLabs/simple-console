/*!
 * simple-console
 * --------------
 * A small, cross-browser-friendly `console` wrapper.
 */
(function (root) {
  // Memoizations.
  var _console;

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

  /**
   * Console abstraction.
   */
  var SimpleConsole = function () {
    var self = this;
    var con = this._getConsole();
    var noConsole = !con;
    con = con || {};
    var i;

    // Patch properties, methods.
    for (i = 0; i < props.length; i++) {
      this[props[i]] = con[props[i]] || EMPTY_OBJ;
    }

    // Enable "apply" and "bind" on methods by converting to real function.
    // See: http://patik.com/blog/complete-cross-browser-console-log/
    for (i = 0; i < meths.length; i++) {
      (function (meth) {
        if (noConsole || !con[meth]) {
          // No console or method: Noop it.
          self[meth] = NOOP;
        } else if (Function.prototype.bind) {
          // IE9 and most others: Bind to our create real function.
          // Should work if `console.FOO` is `function` or `object`.
          self[meth] = Function.prototype.bind.call(con[meth], con);
        } else {
          // IE8: No bind, so even more tortured.
          self[meth] = function () {
            Function.prototype.call.call(con[meth], con,
              Array.prototype.slice.call(arguments));
          };
        }
      })(meths[i]);
    }
  };

  /**
   * Accessor to console object. (Cached).
   *
   * @returns {Object} the console object or `null` if unavailable.
   */
  SimpleConsole.prototype._getConsole = function () {
    if (typeof _console !== "undefined") { return _console; }
    _console = window.console || null;
    return _console;
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