/*!
 * simple-console
 * --------------
 * A small, cross-browser-friendly `console` wrapper.
 */
// Patches
var EMPTY_OBJ = {};
var NOOP = function () {};

// Console attributes
var props = ["memory"];
var meths = (
  "assert,clear,count,debug,dir,dirxml,error,exception,group," +
  "groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd," +
  "show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn"
).split(",");

// Memoizations.
var _console;

/**
 * Console abstraction.
 */
var Console = module.exports = function () {
  var con = this._getConsole();
  var noConsole = !!con;
  con = con || {};
  var i;

  // Patch properties, methods.
  for (i = 0; i < props.length; i++) {
    this[props[i]] = con[props[i]] || EMPTY_OBJ;
  }
  for (i = 0; i < meths.length; i++) {
    // First level patch.
    this[meths[i]] = con[meths[i]] || NOOP;

    // Enable "apply" and "bind" on methods by converting to real function.
    // See: http://patik.com/blog/complete-cross-browser-console-log/
    if (typeof this[meths[i]] !== "function") {
      (function (self, meth) {
        if (!!Function.prototype.bind) {
          // IE9: Bind to our create real function.
          self[meth] = Function.prototype.bind.call(self[meth], self);
        } else {
          // IE8: No bind, so even more tortured.
          self[meth] = function () {
            Function.prototype.call.call(self[meth], self,
              Array.prototype.slice.call(arguments));
          };
        }
      })(this, meths[i]);
    }
  }
};

/**
 * Accessor to console object. (Cached).
 *
 * @returns {Object} the console object or `null` if unavailable.
 */
Console.prototype._getConsole = function () {
  if (typeof _console !== "undefined") { return _console; }
  _console = window.console || null;
  return _console;
};
