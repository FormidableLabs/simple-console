/*!
 * simple-console
 * --------------
 * A small, cross-browser-friendly `console` wrapper.
 */
// Memoizations.
var _console;
var _canApply;

/**
 * Console abstraction.
 */
var Console = function () {};

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

/**
 * Accessor to console object. (Cached).
 *
 * @returns {Object} the console object or `null` if unavailable.
 */
Console.prototype._canApply = function () {
  if (typeof _canApply !== "undefined") { return _canApply; }
  _canApply = !!(this._getConsole() || {}).apply;
  return _canApply;
};

module.exports = new Console();
